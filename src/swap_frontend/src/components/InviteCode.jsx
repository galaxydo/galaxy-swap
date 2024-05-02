import { useEffect } from "react";

function InviteCode({ setInviteCode }) {
    useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlCode = searchParams.get("invite_code");
  
      if (urlCode) {
        window.localStorage.setItem("inviteCode", urlCode);
        setInviteCode(urlCode);
      } else {
        const localStorageItem = window.localStorage.getItem("inviteCode");
        if (localStorageItem) {
          setInviteCode(localStorageItem);
        }
      }
    }, [setInviteCode]);
  
    return null;
  }

export default InviteCode;
