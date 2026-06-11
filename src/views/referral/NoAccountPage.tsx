import { lazy, Suspense } from "react"
import HeroSection from "./components/HeroSection"
import HowToInviteSection from "./components/HowToInviteSection"
import WhyJoinSection from "./components/WhyJoinSection"
const FaqSection = lazy(() => import("./components/FaqSection"))

export const NoAccountPage = () => {
  return (
    <div className="bg-[#131416]">
      {/* Hero主标题区域 */}
      <HeroSection />

      {/* 为什么加入邀请计划 */}
      <WhyJoinSection />

      {/* 如何邀请好友 */}
      <HowToInviteSection />
      <Suspense fallback={null}>
        <FaqSection />
      </Suspense>

    </div>
  )
}

export default NoAccountPage