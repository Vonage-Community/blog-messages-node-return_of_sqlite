-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "messageUuid" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "contextStatus" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "webhookId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "long" REAL NOT NULL,
    CONSTRAINT "Location_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "WebhookEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_messageUuid_key" ON "WebhookEvent"("messageUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Location_webhookId_key" ON "Location"("webhookId");
