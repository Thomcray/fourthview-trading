import {
  Facebook,
  Mail,
  MessageCircle,
  MessageSquareText,
  Phone,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-0 bg-black text-white text-center py-4">
      <h1 className="font-normal text-xl leading-12">Contact Us</h1>
      <div className="flex justify-center space-x-4">
        <Mail className="h-6 w-6 text-white cursor-pointer" />
        <Phone className="h-6 w-6 text-white cursor-pointer" />
        <Twitter className="h-6 w-6 text- cursor-pointer" />
        <Facebook className="h-6 w-6 text-white cursor-pointer" />
        <MessageCircle className="h-6 w-6 text-white cursor-pointer" />
        <MessageSquareText className="h-6 w-6 text-white cursor-pointer" />
      </div>
      {/* &copy; 2025 Fourthview Trading. All rights reserved. */}
    </footer>
  );
}
