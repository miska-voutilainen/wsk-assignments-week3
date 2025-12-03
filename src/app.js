import express from 'express';

const app = express();
const port = 3000;

// Serve static files from public folder
app.use('/public', express.static('public'));

// Hello world route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Cat API endpoint
app.get('/api/v1/cat', (req, res) => {
  const cat = {
    cat_id: 1,
    name: 'Fluffy',
    birthdate: '2022-03-15',
    weight: 4.2,
    owner: 'John Doe',
    image: 'https://loremflickr.com/320/240/cat',
  };

  res.json(cat);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
