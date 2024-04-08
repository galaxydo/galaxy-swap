import Debug "mo:base/Debug";
import AssocList "mo:base/AssocList";

actor {
  public query func greet(name : Text) : async Text {
    Debug.print("I AM GOING TO RETURN 1 now");
    return "Hello, " # name # "!";
  };

  public shared (msg) func greet2(name : Text) : async Text {
    Debug.print(debug_show (msg.caller));
    return "Hello, " # name # "!";
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };
};
