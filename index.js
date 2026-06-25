require('dotenv').config()
const express = require('express')
const app = express()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get('/products', async (req, res) => {
    try{
        const cursor = req.query.cursor
        const category = req.query.category
    
        let query = 'SELECT * FROM products'
        let params = []
        let conditions = []
    
       
        if(cursor) {
          conditions.push(`id < $${params.length + 1}`)
          params.push(cursor)
        }
    
        
        if(category) {
          conditions.push(`category = $${params.length + 1}`)
          params.push(category)  
        }
    
        
        if(conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ')
        }
    
        
        query += ' ORDER BY id DESC LIMIT 20'
        
        const result = await pool.query(query, params)
        const products = result.rows
       
        res.json({
           products: products,
           nextCursor: products.length > 0 ? products[products.length - 1].id : null
         });
    }
    catch(err){
        console.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
});


app.listen(3000,()=>{
    console.log(`Server running on PORT ${3000}`);
});

