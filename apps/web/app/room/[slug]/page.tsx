import { prisma } from "@repo/db/client";
import ChatMessage from "../../../components/chats";

const ChatRoom: React.FC<{ params: Promise<{ slug: string }> }> = async ({
  params
}: {
  params: Promise<{ slug: string }>
}) => {
  const slug = (await params).slug;

  const room = await prisma.room.findFirst({
    where: {
      slug
    },
    select: {
      id: true,
    }
  })

  if(!room) return <div>
    No room found for slug - {slug}
  </div>

  const roomId = room.id.toString();
  return <div>
    <ChatMessage roomId={roomId} />
  </div>
}

export default ChatRoom;