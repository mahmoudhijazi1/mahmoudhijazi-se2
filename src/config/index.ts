import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  logDir: process.env.LOG_DIR || './logs',
  isDev: process.env.NODE_ENV === 'development',
  storagePath: {
    csv: {
      cakes: 'src/data/cake orders.csv',
    },
    data:{
      books:'src/data/book orders.json',
      toys:'src/data/toy orders.xml',
    },
    sqlite: 'src/data/orders.db', 
  },
};
