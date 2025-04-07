import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Users, UserPlus, Check, X } from "lucide-react";

// Mock data - in real app this would come from your backend
const mockUsers = [
  { id: 1, username: "Alice", rank: "Expert", avatar: "/placeholder.svg", status: "online" },
  { id: 2, username: "Bob", rank: "Advanced", avatar: "/placeholder.svg", status: "offline" },
];

const mockFriendRequests = [
  { id: 1, username: "Charlie", rank: "Intermediate", avatar: "/placeholder.svg" },
  { id: 2, username: "David", rank: "Beginner", avatar: "/placeholder.svg" },
];

const mockGroups = [
  { id: 1, name: "Study Group A", members: 5, avatar: "/placeholder.svg" },
  { id: 2, name: "Practice Team B", members: 3, avatar: "/placeholder.svg" },
];

const Chat = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully!",
    });
    
    setMessage("");
  };

  const handleFriendRequest = (action: 'accept' | 'reject', username: string) => {
    toast({
      title: action === 'accept' ? "Friend request accepted" : "Friend request rejected",
      description: `You have ${action}ed ${username}'s friend request`,
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-purple-900">Practice Chat</h1>
          </div>
        </div>

        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="chats" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-4 hover:bg-purple-50 cursor-pointer"
                  onClick={() => setActiveChat(user.username)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{user.username}</p>
                      <span className={`w-2 h-2 rounded-full ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-500">Rank: {user.rank}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="groups" className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {mockGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center space-x-4 p-4 hover:bg-purple-50 cursor-pointer"
                  onClick={() => setActiveChat(group.name)}
                >
                  <Avatar>
                    <AvatarImage src={group.avatar} />
                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.members} members</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requests" className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {mockFriendRequests.map((request) => (
                <div key={request.id} className="flex items-center space-x-4 p-4 border-b">
                  <Avatar>
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback>{request.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{request.username}</p>
                    <p className="text-sm text-gray-500">Rank: {request.rank}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleFriendRequest('accept', request.username)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleFriendRequest('reject', request.username)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-xl font-semibold">{activeChat}</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              {/* Chat messages would go here */}
              <div className="space-y-4">
                <p className="text-center text-gray-500">Start of conversation</p>
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-600">Welcome to Practice Chat</h3>
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;