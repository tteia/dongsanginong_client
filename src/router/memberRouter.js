import MemberSignIn from "@/views/member/login/MemberSignIn.vue";
import KakaoCallback from "@/views/member/login/KakaoCallback.vue";
import GoogleCallback from "@/views/member/login/GoogleCallback.vue";
import MemberSignUp from "@/views/member/login/MemberSignUp.vue";

export const memberRouter = [
  {
    path: "/member/sign-in",
    name: "MemberSignIn",
    component: MemberSignIn,
  },
  {
    path: "/oauth/redirect/kakao",
    name: "KakaoCallback",
    component: KakaoCallback,
  },
  {
    path: "/oauth/redirect/google",
    name: "GoogleCallback",
    component: GoogleCallback,
  },
  {
    path: "/member/sign-up",
    name: "MemberSignUp",
    component: MemberSignUp,
  },
];