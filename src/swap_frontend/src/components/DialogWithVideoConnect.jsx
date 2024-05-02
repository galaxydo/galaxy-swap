import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React from "react";
import CopyToClipboardButton from "./ui/copyToClipboard";

function DialogWithVideoConnect() {
  return (
    <Dialog>
      <DialogTrigger className="absolute top-0 left-0 m-4 text-lg bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded shadow-lg shadow-indigo-600/50">
        Connect Token Inctruction
      </DialogTrigger>
      <DialogContent className="bg-indigo-900 max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect Token Inctruction</DialogTitle>
          <DialogDescription>
            <div className="w-mw-sm h-full">
              The process will take around 1-2 minutes. <br />
              Make sure to add our token to your Plug Wallet. <br />
              <br />
              Instructions: <br />
              <div className="inline-flex items-center border-2 my-2 pl-2 bg-indigo-600 rounded">
                <span className=" flex-grow">wexwn-tyaaa-aaaap-ag72a-cai</span>
                <CopyToClipboardButton textToCopy="wexwn-tyaaa-aaaap-ag72a-cai" />
              </div>
              <br />
              Token standard: ICRC1
              <br />
              <video className="w-full mt-1" controls>
                <source src="/B23_Token.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWithVideoConnect;
