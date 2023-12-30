import { FC, useEffect, useRef, useCallback, useState } from "react";
import Script from "next/script";

type Props = {
  handleSignIn: React.Dispatch<any>;
  clientId: string;
};

export const GoogleSignInButton: FC<Props> = (props) => {
  const { handleSignIn, clientId } = props;
  // refs
  const googleSignInButton = useRef<HTMLDivElement>(null);
  // states
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false);

  const loadScript = useCallback(() => {
    if (!googleSignInButton.current || gsiScriptLoaded) return;

    window?.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleSignIn,
    });

    try {
      window?.google?.accounts.id.renderButton(
        googleSignInButton.current,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          logo_alignment: "center",
          text: "signin_with",
          width: 384,
        } as GsiButtonConfiguration // customization attributes
      );
    } catch (err) {
      console.log(err);
    }

    window?.google?.accounts.id.prompt(); // also display the One Tap dialog

    setGsiScriptLoaded(true);
  }, [handleSignIn, gsiScriptLoaded, clientId]);

  useEffect(() => {
    if (window?.google?.accounts?.id) {
      loadScript();
    }
    return () => {
      window?.google?.accounts.id.cancel();
    };
  }, [loadScript]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer onLoad={loadScript} />
      <div className="!w-full overflow-hidden rounded" id="googleSignInButton" ref={googleSignInButton} />
    </>
  );
};
