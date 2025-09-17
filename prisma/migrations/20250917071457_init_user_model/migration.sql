-- CreateTable
CREATE TABLE "public"."user" (
    "pseudo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP

);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");
