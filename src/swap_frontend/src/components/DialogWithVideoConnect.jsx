import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import React from "react";
import CopyToClipboardButton from "./ui/copyToClipboard";
import { Button } from "./ui/button";

function DialogWithVideoConnect() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="absolute top-0 left-0 m-4 text-lg border-none bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded shadow-lg shadow-indigo-600/50"
        >
          Add Token Instruction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-indigo-900 max-w-md">
        <ScrollArea className="max-h-[90vh] overflow-auto">
          <div className="max-h-full">
            <DialogHeader className="mb-2">
              <DialogTitle>Add WBR23 Token Instructions</DialogTitle>
              <DialogDescription>
                This short video explains how to add WBR23 token to your Plug
                wallet
              </DialogDescription>
            </DialogHeader>
            Token Canister ID:
            <div className="flex items-center my-2">
              <div className="grid flex-1 gap-2">
                <div className="inline-flex items-center border-2 pl-2 bg-indigo-600 rounded">
                  <span className=" flex-grow">
                    wexwn-tyaaa-aaaap-ag72a-cai
                  </span>
                  <CopyToClipboardButton textToCopy="wexwn-tyaaa-aaaap-ag72a-cai" />
                </div>
              </div>
            </div>
            Token standard: ICRC1 <br />
            <video className="w-full mt-1 rounded" controls>
              <source src="/B23_Token.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWithVideoConnect;
