require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})


async function seed(){
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      category VARCHAR(100),
      price DECIMAL,
      created_at TIMESTAMP,
      updated_at TIMESTAMP
    )
  `)
  //add index here
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_products_id ON products(id DESC)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`)
  
    
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports']


  const rows=[];
  for(let i=0;i<200000;i++){
    const category = categories[Math.floor(Math.random() * categories.length)];
    rows.push([
      `Product ${i+1}`,    
      category,           
      Math.floor(Math.random() * 1000) + 10,               
      new Date(),           
      new Date()         
    ]);
  }
   

  const batchSize = 10000;

  for(let b = 0; b < rows.length; b += batchSize){
    const batch = rows.slice(b, b+batchSize);  
    const values = batch.flat() 
    const placeholders = batch.map((_, i) => 
      `($${i*5+1}, $${i*5+2}, $${i*5+3}, $${i*5+4}, $${i*5+5})`
    ).join(',')

    await pool.query(
      `INSERT INTO products (name, category, price, created_at, updated_at) VALUES ${placeholders}`,
      values 
    )

    console.log(`Inserted batch ${b/batchSize + 1}`);
  }




  console.log('200,000 products inserted!')
  await pool.end();
}

seed();