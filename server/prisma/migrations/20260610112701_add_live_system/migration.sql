-- CreateTable
CREATE TABLE "Live" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "hostId" TEXT NOT NULL,
    "zoomMeetingId" TEXT,
    "zoomJoinUrl" TEXT,
    "recordingUrl" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Live_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Live" ADD CONSTRAINT "Live_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
