-- CreateTable
CREATE TABLE "public"."message" (
    "id" SERIAL NOT NULL,
    "pseudo" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);
