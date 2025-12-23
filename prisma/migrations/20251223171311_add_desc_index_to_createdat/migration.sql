-- CreateIndex
CREATE INDEX "Thought_createdAt_idx" ON "Thought"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Thread_createdAt_idx" ON "Thread"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ThreadComment_createdAt_idx" ON "ThreadComment"("createdAt" DESC);
