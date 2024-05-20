import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import React from "react";
import CopyToClipboardButton from "./ui/copyToClipboard";
import { Button } from "./ui/button";
import VideoPlayer from "./videoPlayer";

function DialogWithVideoConnect() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="absolute top-0 left-0 m-4 text-lg border-none bg-button bg-button-hover py-2 px-4 rounded shadow-custom"        >
          Add Token Instruction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card max-w-md">
        <ScrollArea className="max-h-[90vh] overflow-auto">
          <div className="max-h-full">
            <DialogHeader className="mb-2">
              <DialogTitle>Add Galaxy Token Instructions</DialogTitle>
              <DialogDescription>
                This short video explains how to add Galaxy token to your Plug
                wallet
              </DialogDescription>
            </DialogHeader>
            Token Canister ID:
            <div className="flex items-center my-2">
              <div className="grid flex-1 gap-2">
                <div className="inline-flex items-center border-2 pl-2 bg-button rounded">
                  <span className=" flex-grow">
                    wexwn-tyaaa-aaaap-ag72a-cai
                  </span>
                  <CopyToClipboardButton textToCopy="wexwn-tyaaa-aaaap-ag72a-cai" />
                </div>
              </div>
            </div>
            Token standard: ICRC1 <br />
            <VideoPlayer className="mt-1" />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWithVideoConnect;
