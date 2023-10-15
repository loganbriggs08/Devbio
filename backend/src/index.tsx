import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(express.json());

/*


User auth - Discord OAuth
|-> user data

Subscriptions - Stripe

Explore
|-> Ranking ( Per user )
|-> Premium users - boosted
|-> Hirable

Signup - idea

*/

app.use(express.json());
app.use(session({
  secret: 'JALSKFJOASJFOASHFABVOIASHJFIOHOAW',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
}));
app.use(express.urlencoded());
app.use((req: Request, res: Response, next) => {
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  
});




app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});