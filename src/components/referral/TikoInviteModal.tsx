import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "../image/LazyImage";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useTranslation } from "@/hooks/useTranslation";
import { Trans } from "../trans";
import QRCode from "../qrcode";
import CopyButtonV2 from "../button/CopyButtonV2";


interface TikoInviteModalProps {
  open: boolean;
  onClose: () => void;
  inviteCode?: string;
  qrCodeSrc?: string;
}

export default function TikoInviteModal({
  open,
  onClose,
  inviteCode = "TikoABCDEFG12",
  qrCodeSrc = "",
}: TikoInviteModalProps) {
  const { t } = useTranslation()
  const { unlock, lock } = useBodyScrollLock()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if(!open) {
      unlock()
    } else {
      lock()
    }
  }, [open, unlock, lock])

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-[calc(100vw-32px)] max-w-[375px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-2xl bg-[#111111] text-white shadow-2xl">
        <button
          onClick={onClose}
          data-html-to-image-ignore="true"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white absolute top-4 right-3 z-[51]"
        >
          <X size={20} />
        </button>
        <div className="bg-[#0F0F11]">
          <div className="flex items-center justify-between px-5 pt-6">
            <div className="flex items-center gap-0.5 select-none">
              <LazyImage src="/images/referral/tiko_logo.png" className="w-[55px] h-[21px]" />
            </div>
            
          </div>

          <div className="px-5 pt-4 text-center">
            <h2 className="text-[28px] font-bold leading-[110%]">
              <Trans 
                i18nKey="ref.t26" 
                values={{ r1: '50%' }} 
                components={{
                  r1: <span className="font-semibold text-[#9CFF3A]" />
                }}
              />
              
            </h2>
          </div>

          <div className="mt-4 min-h-[226px]">
            <LazyImage src="/images/referral/invite.webp" className="w-[340px]" />
          </div>

          {/* <div className="mt-4 px-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1.5 text-sm text-[#FFFFFF]">
                <img src="/images/referral/icon_left.png" className="w-[98px] h-[6px]" alt="" />
                <span>{t("ref.t15")}</span>
                <img src="/images/referral/icon_right.png" className="w-[98px] h-[6px]" alt="" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center bg-[url('/images/referral/border.svg')] px-6 py-3.5" style={{backgroundSize: '100% 100%'}}>
              <span className="text-[24px] font-medium tracking-widest text-[#9CFF3A]">{inviteCode}</span>
            </div>
          </div> */}

          <div className="mt-4 flex items-center justify-between px-5 pb-4">
            <div>
              <p className="text-base font-medium text-white leading-[100%]">{t("ref.t22")}</p>
              <p className=" text-xs text-[#9DA3AF] font-normal leading-[100%] mt-[2px]">{t("ref.t23")}</p>
              <div className="mt-2 border border-[rgba(156,255,58,0.35)] rounded-[4px] h-[24px] flex items-center px-[6px] gap-1 text-[12px] text-[#9CFF3A] font-semibold">
                <span className=" font-medium">{t("ref.t15")}</span> {inviteCode}
              </div>
            </div>
            <div className="h-[72px] w-[72px] overflow-hidden p-[6px] border-[#232427] border rounded-[6px] bg-[rgba(255,255,255, 0.05)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img src={qrCodeSrc} alt="QR" className="h-full w-full" crossOrigin="anonymous" /> */}
              <QRCode value={qrCodeSrc} size={60} />
            </div>
          </div>
        </div>

        <div className="px-5 pb-6">
          <CopyButtonV2 copyText={qrCodeSrc}>
            <Button
              className="w-full h-[48px] bg-[#9CFF3A] py-4 text-black hover:bg-[#6fd42e] text-[16px] font-semibold"
            >
              {t("ref.t24")}
            </Button>
          </CopyButtonV2>
          <div className="mt-2 flex items-center justify-center gap-4">
            <p className="text-sm text-[#9DA3AF]">{t("ref.t25")}</p>
          </div>
        </div>
        
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
