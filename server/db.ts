import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

// Unified query response interface
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DbClient {
  query: (text: string, params?: any[]) => Promise<QueryResult>;
  getStatus: () => { driver: 'postgres' | 'pglite'; connected: boolean; info: string };
}

let activeDb: DbClient;
let dbDriver: 'postgres' | 'pglite' = 'postgres';
let isConnected = false;
let statusMessage = 'Initializing database...';

async function initPostgresPool(): Promise<Pool | null> {
  const connectionString = process.env.DATABASE_URL;
  const poolConfig = connectionString 
    ? { connectionString, connectionTimeoutMillis: 3000 }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: process.env.PGDATABASE || 'risers_db',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        connectionTimeoutMillis: 3000,
      };

  const pool = new Pool(poolConfig);

  try {
    const client = await pool.connect();
    client.release();
    isConnected = true;
    dbDriver = 'postgres';
    statusMessage = `Connected to external PostgreSQL (${connectionString ? 'via DATABASE_URL' : 'localhost:5432'})`;
    console.log(`[Database] PostgreSQL connection established successfully.`);
    return pool;
  } catch (err: any) {
    console.warn(`[Database] Could not connect to external PostgreSQL (${err.message}).`);
    await pool.end().catch(() => {});
    return null;
  }
}

async function initPglite(): Promise<any> {
  const { PGlite } = await import('@electric-sql/pglite');
  const dataDir = path.resolve(process.cwd(), 'data', 'postgres');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const pglite = new PGlite(dataDir);
  await pglite.waitReady;
  isConnected = true;
  dbDriver = 'pglite';
  statusMessage = `Using embedded PostgreSQL engine (PGlite @ ${dataDir})`;
  console.log(`[Database] Embedded PostgreSQL (PGlite) active. Data stored at ./data/postgres.`);
  return pglite;
}

export async function initializeDatabase(): Promise<DbClient> {
  let pool = await initPostgresPool();

  if (pool) {
    activeDb = {
      query: async (text: string, params: any[] = []) => {
        const res = await pool!.query(text, params);
        return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length };
      },
      getStatus: () => ({ driver: dbDriver, connected: isConnected, info: statusMessage }),
    };
  } else {
    // Graceful fallback to official embedded PostgreSQL (PGlite)
    console.log('[Database] Falling back to embedded PostgreSQL (PGlite) so the app works seamlessly out-of-the-box.');
    const pglite = await initPglite();
    activeDb = {
      query: async (text: string, params: any[] = []) => {
        const res = await pglite.query(text, params);
        return { rows: res.rows, rowCount: res.rows.length };
      },
      getStatus: () => ({ driver: dbDriver, connected: isConnected, info: statusMessage }),
    };
  }

  await runMigrationsAndSeed(activeDb);
  return activeDb;
}

async function runMigrationsAndSeed(db: DbClient) {
  console.log('[Database] Verifying tables and schema...');

  // 1. Submissions Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id VARCHAR(100) PRIMARY KEY,
      name TEXT NOT NULL,
      school_or_college TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      short_description TEXT NOT NULL,
      contact_method TEXT NOT NULL,
      city TEXT,
      work_link TEXT,
      is_under_18 BOOLEAN DEFAULT FALSE,
      guardian_contact TEXT,
      consent_confirmed BOOLEAN DEFAULT TRUE,
      submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'New',
      admin_notes TEXT
    );
  `);

  // 2. Stories Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS stories (
      id VARCHAR(100) PRIMARY KEY,
      title TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      student_name TEXT NOT NULL,
      school_or_college TEXT,
      city TEXT,
      cover_image TEXT NOT NULL,
      alt_text TEXT,
      short_intro TEXT,
      work_summary TEXT,
      journey TEXT,
      challenges TEXT,
      lessons TEXT,
      relevant_links JSONB DEFAULT '[]',
      publication_date VARCHAR(100),
      author VARCHAR(100),
      youtube_url TEXT,
      public_profile_links JSONB DEFAULT '[]',
      status VARCHAR(50) DEFAULT 'draft',
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Episodes Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS episodes (
      id VARCHAR(100) PRIMARY KEY,
      title TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      alt_text TEXT,
      youtube_url TEXT,
      episode_number INT,
      date VARCHAR(100),
      language VARCHAR(100),
      host_or_participants TEXT,
      summary TEXT,
      key_points JSONB DEFAULT '[]',
      transcript_excerpt TEXT,
      status VARCHAR(50) DEFAULT 'draft',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Interviews Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS interviews (
      id VARCHAR(100) PRIMARY KEY,
      title TEXT NOT NULL,
      guest_name TEXT NOT NULL,
      guest_role TEXT,
      organisation TEXT,
      portrait TEXT NOT NULL,
      youtube_url TEXT,
      summary TEXT,
      student_takeaways JSONB DEFAULT '[]',
      language VARCHAR(100),
      publication_date VARCHAR(100),
      status VARCHAR(50) DEFAULT 'draft',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Settings Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL
    );
  `);

  // Seed default seed data if tables are empty
  await seedInitialData(db);
}

async function seedInitialData(db: DbClient) {
  // Check submissions
  const subCount = await db.query('SELECT COUNT(*) as count FROM submissions');
  const hasSubmissions = parseInt(subCount.rows[0]?.count || '0', 10) > 0;

  if (!hasSubmissions) {
    console.log('[Database] Seeding initial submissions...');
    await db.query(`
      INSERT INTO submissions (
        id, name, school_or_college, category, short_description, 
        contact_method, city, work_link, is_under_18, guardian_contact, 
        consent_confirmed, submitted_at, status, admin_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
    `, [
      'sub-sample-01',
      'Priya Nambiar',
      'Osmania University College of Technology',
      'Student Talent',
      'Built a low-cost solar water filter prototype for suburban communities. Tested in 3 localities.',
      'priya.filter@example.edu',
      'Hyderabad',
      'https://github.com/example/solar-filter',
      false,
      null,
      true,
      new Date(Date.now() - 86400000 * 2).toISOString(),
      'New',
      'Editorial desk marked for preliminary interview outreach.'
    ]);

    await db.query(`
      INSERT INTO submissions (
        id, name, school_or_college, category, short_description, 
        contact_method, city, work_link, is_under_18, guardian_contact, 
        consent_confirmed, submitted_at, status, admin_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
    `, [
      'sub-sample-02',
      'Rohit Sen',
      'St. Andrews School',
      'Student Entrepreneur',
      'Founded a campus thrift clothing exchange reducing seasonal fabric waste. Rehomed over 400 items.',
      'rohit.thrift@example.com',
      'Secunderabad',
      'https://instagram.com/reclaimthrift',
      true,
      'Suresh Sen (+91 98765 43210)',
      true,
      new Date(Date.now() - 86400000 * 5).toISOString(),
      'Contacted',
      'Guardian consent verified. Scheduling audio discussion.'
    ]);
  }

  // Check stories
  const storyCount = await db.query('SELECT COUNT(*) as count FROM stories');
  if (parseInt(storyCount.rows[0]?.count || '0', 10) === 0) {
    console.log('[Database] Seeding initial stories...');
    await db.query(`
      INSERT INTO stories (
        id, title, category, student_name, school_or_college, city,
        cover_image, alt_text, short_intro, work_summary, journey,
        challenges, lessons, relevant_links, publication_date, author,
        status, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      'story-ananya-assistive-tech',
      'Building Telugu-Voice Tools for Rural Classrooms: Ananya\'s Journey',
      'Student Talent',
      'Ananya Varma',
      'VNR Vignana Jyothi Institute of Engineering & Technology',
      'Hyderabad',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      'Ananya working on voice-enabled educational software for regional schools',
      'Third-year student Ananya combined deep speech processing with regional dialects to help primary students learn phonetics in Telugu and English.',
      'Ananya developed "Bala Vani", a lightweight offline web utility designed for low-bandwidth rural government schools.',
      'Starting with small open-source contributions in her first semester, Ananya noticed that audio tools in education predominantly focused on standard accents.',
      'Balancing intensive university coursework with field testing was tough.',
      '“Technology is only as smart as the empathy behind it. Building for real classrooms taught me that clarity beats complexity every single time.”',
      JSON.stringify([{ label: 'GitHub Repository', url: 'https://github.com' }]),
      'March 14, 2026',
      'RISERS Editorial Team',
      'published',
      true
    ]);

    await db.query(`
      INSERT INTO stories (
        id, title, category, student_name, school_or_college, city,
        cover_image, alt_text, short_intro, work_summary, journey,
        challenges, lessons, relevant_links, publication_date, author,
        status, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      'story-karthik-green-pack',
      'From Dorm Experiment to Zero-Waste Campus Delivery: Karthik\'s RePack',
      'Student Entrepreneurs',
      'Karthik Rao',
      'University College of Engineering, Osmania University',
      'Hyderabad',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      'Karthik demonstrating reusable campus packaging modules',
      'When Karthik saw mountains of single-use takeaway plastic piling up near campus hostels, he mobilized cafeteria vendors to adopt reusable returnable meal containers.',
      'Karthik founded "RePack Campus", a circular packaging system partnering with 12 food kiosks around the university.',
      'It began with a campus petition that Karthik turned into a viable operational model.',
      'The biggest operational roadblock was inventory loss during the first month.',
      '“A business idea succeeds when you solve the vendor’s problem first. The green impact follows naturally when the unit economics work.”',
      JSON.stringify([{ label: 'Venture Showcase', url: 'https://risers.org' }]),
      'March 08, 2026',
      'RISERS Editorial Team',
      'published',
      false
    ]);
  }

  // Check episodes
  const epCount = await db.query('SELECT COUNT(*) as count FROM episodes');
  if (parseInt(epCount.rows[0]?.count || '0', 10) === 0) {
    console.log('[Database] Seeding initial episodes...');
    await db.query(`
      INSERT INTO episodes (
        id, title, thumbnail, alt_text, youtube_url, episode_number,
        date, language, host_or_participants, summary, key_points,
        transcript_excerpt, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
      'sr-ep-01',
      'Finding Your Rhythm: Balancing Academics and Creative Passions',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
      'Student Radio studio recording microphone and headphones',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      1,
      'March 18, 2026',
      'Telugu & English (Bilingual)',
      'Hosted by RISERS Student Team with guest student musicians & debaters',
      'In our debut YouTube edition of Student Radio, three undergraduate students share honest insights on handling semester deadlines while managing creative ventures.',
      JSON.stringify([
        'How to maintain consistent creative time without dropping academic grades',
        'Communicating with parents about non-traditional career aspirations',
        'Overcoming burnout when self-initiated projects hit a plateau'
      ]),
      '“The biggest myth is that you must wait until graduation to start building. What you create during your campus years shapes how you view challenges for life.”',
      'published'
    ]);
  }

  // Check interviews
  const interviewCount = await db.query('SELECT COUNT(*) as count FROM interviews');
  if (parseInt(interviewCount.rows[0]?.count || '0', 10) === 0) {
    console.log('[Database] Seeding initial interviews...');
    await db.query(`
      INSERT INTO interviews (
        id, title, guest_name, guest_role, organisation, portrait,
        youtube_url, summary, student_takeaways, language, publication_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      'pi-sridhar-aerospace',
      'What High-Tech Engineering Teams Actually Value in Fresh Graduates',
      'Dr. Sridhar Ramanathan',
      'Principal Propulsion Scientist',
      'National Aerospace Technology Labs',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'Dr. Ramanathan reflects on 24 years in aerospace engineering and shares why curiosity, debugging resilience, and first-principles thinking matter far more than textbook memorization.',
      JSON.stringify([
        'Build physical or software prototypes on your own time — real failures teach deeper mechanics than textbook tests.',
        'Learn how to write precise documentation; great ideas get rejected when engineers cannot communicate them clearly.',
        'Do not fear unconventional paths: many of our finest innovators started in completely different disciplines.'
      ]),
      'English & Telugu',
      'March 10, 2026',
      'published'
    ]);
  }

  // Check settings
  const settingsCount = await db.query('SELECT COUNT(*) as count FROM settings WHERE key = $1', ['site_settings']);
  if (parseInt(settingsCount.rows[0]?.count || '0', 10) === 0) {
    await db.query(`
      INSERT INTO settings (key, value) VALUES ($1, $2)
    `, [
      'site_settings',
      JSON.stringify({
        featuredStudentStoryId: 'story-ananya-assistive-tech',
        forceRadioComingSoon: false
      })
    ]);
  }
}

export const getDb = () => {
  if (!activeDb) {
    throw new Error('Database not initialized. Please call initializeDatabase() first.');
  }
  return activeDb;
};
