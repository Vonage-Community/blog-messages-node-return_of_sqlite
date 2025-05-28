import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import { PrismaClient } from ".prisma/client"

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const prisma = new PrismaClient();
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/webhook', async (req, res) => {
  try {
    const { channel, message_uuid, to, from, timestamp, context_status, message_type, location } = req.body

    // Save the webhook data in the database
    const webhook = await prisma.webhookEvent.create({
      data: {
        channel,
        messageUuid: message_uuid,
        to,
        from,
        timestamp: new Date(timestamp),
        contextStatus: context_status,
        messageType: message_type,
        location: location ? {
          create: {
            lat: location.lat,
            long: location.long
          }
        } : undefined
      },
      include: { location: true } // Optional: Include related location in the response
    })

    console.log('Webhook saved:', webhook)
    res.status(201).json({ message: 'Webhook saved successfully', webhook })
  } catch (error) {
    console.error('Error saving webhook:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});