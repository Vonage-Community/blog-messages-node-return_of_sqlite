"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require(".prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { channel, message_uuid, to, from, timestamp, context_status, message_type, location } = req.body;
        // Save the webhook data in the database
        const webhook = yield prisma.webhookEvent.create({
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
        });
        console.log('Webhook saved:', webhook);
        res.status(201).json({ message: 'Webhook saved successfully', webhook });
    }
    catch (error) {
        console.error('Error saving webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
