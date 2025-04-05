import { v4 as uuid4 } from "uuid"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { login } from "@/apis/auth";
import { useToast } from "@/hooks/toast";
import { useAtom } from "jotai";
import { authTokenAtom } from "@/atoms/global.atom";
import { usePrivy } from "@privy-io/react-auth";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast();

  const [, setToken] = useAtom(authTokenAtom);

  const { ready, authenticated, login, logout, user, connectWallet } = usePrivy();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    console.log("authenticated", authenticated);
  }, [authenticated]);

  // const handleSignMessage = async () => {
  //   if (connected) {
  //     const signature = await signMessage({
  //       message: import.meta.env.VITE_SIGNATURE_MESSAGE,
  //       nonce: uuid4().toString()

  //     });
  //     const { message, statusCode } = await login(account?.address.toString()!, account?.publicKey.toString()!, signature.fullMessage, signature.signature.toString());

  //     if (statusCode === 200) {
  //       setToken(message);
  //       toast({
  //         type: "success",
  //         message: "Logged in successfully",
  //         duration: 3000
  //       });
  //     } else {
  //       toast({
  //         type: "danger",
  //         message: message,
  //         duration: 3000
  //       });
  //     }

  //   }
  // }

  // useEffect(() => {
  //   console.log(connected);
  //   handleSignMessage();
  // }, [connected])

  return (
    <div className="fixed left-0 top-0 right-0 bottom-auto bg-transparent z-[9999]">
      <div className="w-full px-4 py-2 md:pt-6"> {/* Added md:pt-6 for desktop padding-top */}
        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Link to="/" className="flex items-center bg-black text-white h-14 px-4 rounded-lg">
            <img
              src="/images/icon-256w.png"
              loading="lazy"
              height="32"
              width="32"
              alt="ShillTube Logo"
              className="mr-3"
            />
            <div className="text-white text-base font-medium">ShillTube</div>
          </Link>

          <button
            onClick={toggleMenu}
            className="flex items-center justify-center bg-black text-white h-14 w-14 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex justify-center w-full">
          <div className="flex items-center justify-center w-full max-w-[940px]">
            <div className="flex items-center bg-black text-white h-14 rounded-lg mx-auto">
              <Link to="/" className="flex items-center px-4">
                <img
                  src="/images/icon-256w.png"
                  loading="lazy"
                  height="32"
                  width="32"
                  alt="ShillTube Logo"
                  className="mr-3"
                />
                <div className="text-white text-base font-medium">ShillTube</div>
              </Link>
              <div className="h-14 w-[1px] bg-white/20"></div>
              <nav className="flex items-center px-3">
                <Link to="/explore" className="px-4 py-2 text-white text-base hover:text-yellow">Explore</Link>
                {authenticated && (
                  <>
                    <Link to="/list-token" className="px-4 py-2 text-white text-base hover:text-yellow">List Token</Link>
                    <Link to="/dashboard" className="px-4 py-2 text-white text-base hover:text-yellow">Dashboard</Link>
                    <Link to="/create-character" className="px-4 py-2 text-white text-base hover:text-yellow">Create Character</Link>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-mono">
                        {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                      </span>
                      <button
                        onClick={logout}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                )}

                {!authenticated && (
                  <button
                    onClick={login}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md"
                  >
                    Connect Wallet
                  </button>
                )}


              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/90 z-50">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-[280px] px-4">
                <Link
                  to="/explore"
                  className="block w-full text-center text-white text-lg font-medium py-3 border-b border-gray-800 hover:text-[#ff3979]"
                  onClick={toggleMenu}
                >
                  Explore
                </Link>
                {authenticated && (
                  <>
                    <Link
                      to="/list-token"
                      className="block w-full text-center text-white text-lg font-medium py-3 border-b border-gray-800 hover:text-[#ff3979]"
                      onClick={toggleMenu}
                    >
                      List Token
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block w-full text-center text-white text-lg font-medium py-3 border-b border-gray-800 hover:text-[#ff3979]"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/create-character"
                      className="block w-full text-center text-white text-lg font-medium py-3 border-b border-gray-800 hover:text-[#ff3979]"
                      onClick={toggleMenu}
                    >
                      Create Character
                    </Link>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-mono">
                        {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                      </span>
                      <button
                        onClick={logout}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar