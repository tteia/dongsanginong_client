<template>     
    <v-container>
      <!-- 🔖 LIVE LIST 화면 -->
      <template v-if="!session">   
        <!-- 즐겨찾기 농장 중 진행중인 라이브 : seller에게는 나타나지 않음 -->
        <v-card 
          style="border-radius: 15px; padding: 18px; max-width: 1200px; width: 100%;" rounded="0" 
          flat 
          v-if="!isSeller">
          <div>
            <v-card-title style="font-size: 23px;"> <span style="font-weight: bold;">✨Favorites </span>
              <span style="font-size: 15px; color: grey;">스크랩 된 농장의 라이브 목록입니다.</span>
            </v-card-title>
          </div>
          <br>
          <div style="display: flex; justify-content: center; align-items:center;">
            <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
            <v-window v-model="onboarding" style="width: 1080px;">
              <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
                <v-row class="d-flex justify-start flex-wrap">
                  <v-col 
                    v-for="live in paginatedLives(n)" 
                    :key="live.id" 
                    cols="12" 
                    md="2"
                    class="d-flex justify-start"
                    >
                    <v-card variant="text"  
                    class="live-card-fav"
                    @click="joinExistingSession(live.id)">
                      <div class="progress-border">
                        <div class="inner-border">
                          <v-img
                            class="live-image"
                            width="100%"
                            height="100%"
                            :src="live.liveImage"
                            alt="live 썸네일"
                            cover
                          />
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
            <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>
          </div>
          <br>
        </v-card>
        <div v-if="!isSeller" >
          <br>
          <div class="hr-style"></div>
          <br>
        </div>
        <!-- 진행 중인 라이브 목록 (전체) -->
        <v-container style="width: 100%; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; text-align: left; margin-left: 2%;">바로 지금! 라이브 찬스</div>
          <v-btn v-if="isSeller" class="start-btn" @click="openModal">라이브 시작</v-btn>
          <div style="margin-left: 2%; margin-top: 2%;">
            <v-row>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === ''}" @click="setCategory('')">
                <i class="mdi mdi-view-list" style="font-size: 15px;"></i>전체
              </v-btn>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === '과일'}" @click="setCategory('과일')">
                <i class="mdi mdi-food-apple" style="font-size: 15px;"></i>과일
              </v-btn>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === '채소'}" @click="setCategory('채소')">
                <i class="mdi mdi-mushroom" style="font-size: 15px;"></i>채소
              </v-btn>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === '견과/쌀'}" @click="setCategory('견과/쌀')">
                <i class="mdi mdi-food-croissant" style="font-size: 15px;"></i>견과/쌀
              </v-btn>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === '육류'}" @click="setCategory('육류')">
                <i class="mdi mdi-food-drumstick" style="font-size: 15px;"></i>육류
              </v-btn>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === '계란'}" @click="setCategory('계란')">
                <i class="mdi mdi-egg" style="font-size: 15px;"></i>계란
              </v-btn>
              <v-btn class="cat-btn" :class="{'active-cat-btn': category === '유제품'}" @click="setCategory('유제품')">
                <i class="mdi mdi-cup-water" style="font-size: 15px;"></i>유제품
              </v-btn>
              
            </v-row>
          </div>
          <br>
          <v-container class="d-flex custom-card-container">
            <v-row class="justify-start">
              <v-card 
                v-for="live in filteredLiveList" 
                :key="live.liveId" 
                class="live-card" 
                md="2" 
                variant="text" 
                style="width:200px; height:340px; margin: 10px; margin-bottom: 15px;" 
                @click="joinExistingSession(live.liveId)">
                <div v-if="live.participantCount !== null && live.participantCount !== undefined" class="viewer-count">
                  {{ live.participantCount - 1}}명 시청 중
                </div>
                <!-- 프리뷰 라이브 -->
                <!-- <video
                  v-if="live.isPreviewing"
                  :ref="'videoPlayer-' + live.liveId"
                  muted
                  autoplay
                  loop
                  class="live-video-preview"
                  style="width: 100%; height: 280px; object-fit: cover; border-radius: 15px;"
                ></video> -->
                <!-- 썸네일 -->
                <!-- <v-img
                  width="100%"
                  height="280px"
                  :src="live.liveImage"
                  alt="live 썸네일" 
                  cover
                /> -->
                <div style="position: relative;  width: 100%; height: 280px;">
                  <!-- 썸네일 이미지 -->
                  <v-img
                    width="100%"
                    height="280px"
                    :src="live.liveImage"
                    alt="live 썸네일"
                    cover
                  />
                  <!-- 프리뷰 라이브 영상 -->
                  <video
                    v-show="live.isPreviewing"
                    :ref="'videoPlayer-' + live.liveId"
                    muted
                    autoplay
                    loop
                    class="live-video-preview"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;"
                  ></video>
                </div>
                <v-card-text>
                  <span v-if="live.title.length > 10">
                    [ {{ live.farmName }} ] {{ live.title.substring(0, 10) }}... 
                  </span>
                  <span v-else>[ {{ live.farmName }} ] {{ live.title }}</span>
                </v-card-text>
              </v-card>
            </v-row>
          </v-container>
        </v-container>

        <v-dialog v-model="loginConfirmModalVisible" max-width="350px">
          <v-card class="login-modal">
            <v-card-text style="text-align: center;">로그인이 필요한 서비스 입니다. <br> 로그인 하시겠습니까?</v-card-text>
            <v-card-actions>
              <v-btn class="login-modal-btn" @click="goToLogin" style="background-color: #BCC07B;">확인</v-btn>
              <v-btn class="login-modal-btn" @click="loginConfirmModalVisible = false" style="background-color: #e0e0e0;">취소</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 라이브 시작 모달창 : seller가 title과 썸네일 사진을 추가함 -->
        <v-dialog v-model="startLiveDialog" max-width="500px"  @click:outside="cancelLive">
          <v-card class="live-modal">
            <v-card-text style="display: flex; align-items: center; justify-content: center">
              <img src="/live.png" width=40 alt="Logo" style="padding-bottom:2px;" />
              <h3>라이브 시작하기</h3>
            </v-card-text>
            <v-text-field
              v-model="title"
              placeholder="라이브 제목을 작성하세요."
              hide-details
              solo-inverted
              flat
              class="live-input"
              prepend-inner-icon="mdi-emoticon-happy-outline"
            ></v-text-field>
            <v-select
              v-model="category"
              :items="['과일', '채소', '견과/쌀', '육류', '계란', '유제품']"
              label="카테고리를 선택하세요"
              hide-details
              solo-inverted
              style="margin-top: 5px;"
              prepend-inner-icon="mdi-emoticon-happy-outline"
            ></v-select>
            <v-file-input
              label="썸네일 이미지를 추가하세요."
              accept="image/*"
              @change="onThumbnailImageUpload"
              style="margin-top: 5px;"
            />
            <v-row class="modal-action">
              <v-btn class="modal-btn" @click="startLive" style="background-color: #BCC07B;">시작</v-btn>
              <v-btn class="modal-btn" @click="cancelLive" style="background-color: #e0e0e0;">취소</v-btn>
            </v-row>
          </v-card>
        </v-dialog>

        <!-- 농장 생성 라우팅 모달 -->
        <v-dialog v-model="createFarmModal" max-width="280px">
          <v-card class="farm-card">
            <v-card-text>농장이 존재하지 않습니다.</v-card-text>
            <v-card-actions class="justify-center" style="margin-top: -10px;">
              <v-btn class="farm-btn" @click="routeToCreateFarm">확인</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </template>
    </v-container>
</template>
  
<script>
import axios from 'axios';
import { OpenVidu } from "openvidu-browser";
export default {
    data() {
        return {
            isSeller: false,
            favoritesLiveList: [], 
            onboarding: 1,
            windowCount: 3,
            liveList: [],
            startLiveDialog: false,
            createFarmModal: false,

            isPublisher: false, // 방송자 여부 
            title: "",
            liveImage: "",
            file: null,
            farmName: "",
            profileImageUrl: "",
            category: "",
            filteredLiveList: [],

            isLoading: false,
            isLastPage: false,
            currentPage: 0,
            pageSize: 7,
            session: null,

            isLoggedIn: false,
            loginDialog: false,
            loginConfirmModalVisible: false,
        };
    },
    async created() {
        const accessToken = localStorage.getItem('accessToken');
        this.isLoggedIn = !!accessToken;
        // 즐겨찾기 뿌리기
        const role = localStorage.getItem('role');
        if (role === 'SELLER') {
            this.isSeller = true;
        } else {
            this.isSeller = false;     
            try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/favorites/farm/live/list`, {
                headers: {
                myId: localStorage.getItem('memberId')
                }
            });
            this.favoritesLiveList = response.data;
            console.log(this.favoritesLiveList);

            setTimeout(() => {
              this.playPreviewAll();
            }, 1000); // 1.5초 뒤에 프리뷰 출력

            this.windowCount = Math.ceil(this.favoritesLiveList.length / 4);
            } catch (e) {
            console.log(e.message);
            }
        }
        // 전체 라이브 목록 뿌리기
        let params = {
            page: this.currentPage,
            size: this.pageSize,
        };
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/active`, {params});
            console.log("전체 : ", response.data.content);
            this.liveList = response.data.content;

            this.liveList.forEach(live => {
              Object.assign(live, { isPreviewing: false, session: null });
            }); // ispreviewing 필드 live에 추가 

            this.filteredLiveList = this.liveList;  // 필터링 목록 초기화  
            setTimeout(() => {
              this.playPreviewAll();
            }, 1000);
        } catch(e) {
            console.log(e);
        }
        window.addEventListener('scroll', this.scrollPagination);
    },
    methods: {
        setCategory(category) {     
          // 카테고리 변경할 때 프리뷰 끊기 
          this.filteredLiveList.forEach(live => {
            live.isPreviewing = false;
            console.log(">>>>>" + live.liveId + "번째 라이브 중지");
          });

          this.category = category;             
          if (this.category === "") {                      
            this.filteredLiveList = this.liveList;             
          } else {                            
            this.filteredLiveList = this.liveList.filter((live) => live.category === this.category);             
          }
          
          setTimeout(() => {
            this.playPreviewAll();
          }, 1000); // 1.5초 뒤에 프리뷰 출력
        }, 
        // 썸넬 이미지 등록 
        async handleImageUpload(blob) {
            const accessToken = localStorage.getItem('accessToken');
            const body = {
                prefix: "Live",
                url: `${blob?.name}`,
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const getUrl = await fetch(`${process.env.VUE_APP_API_BASE_URL}/product-service/api/upload/presigned-url`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });
            const urlContentType = getUrl.headers.get("content-type");
            let getUrlResult;
            if (urlContentType && urlContentType.includes("application/json")) {
                getUrlResult = await getUrl.json(); // JSON으로 파싱
            } else {
                getUrlResult = await getUrl.text(); // 텍스트로 파싱
            }
            const awsUrl = {
                data: `${getUrlResult.split("?")[0]}`,
                auth: `?${getUrlResult.split("?")[1]}`,
            };
            const options = {
                method: "PUT", // PUT 메서드 사용
                headers: {
                    "Content-Type": blob.type, // Blob의 MIME 타입 설정
                },
                body: blob, // 업로드할 파일 데이터
            };
            await fetch(awsUrl.data + awsUrl.auth, options);
            return awsUrl.data;
        },
        async onThumbnailImageUpload(event) {
            const file = event?.target?.files[0];
            this.liveImage = await this.handleImageUpload(file);
        },
        // 즐찾 리스트 슬라이더
        paginatedLives(page) {
            const livePerPage = 4;
            const start = (page - 1) * livePerPage;
            const end = start + livePerPage;
            return this.favoritesLiveList.slice(start, end);
        },
        next() {
            this.onboarding = this.onboarding + 1 > this.windowCount ? 1 : this.onboarding + 1;
        },
        prev() {
            this.onboarding = this.onboarding - 1 <= 0 ? this.windowCount : this.onboarding - 1;
        },
        // 스크롤
        async loadLive() {
            try {
                if(this.isLoading || this.isLastPage) return;
                this.isLoading = true;
                this.currentPage++;
                let params = {
                    page: this.currentPage,
                    size: this.pageSize,
                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/active`, { params });
                const additionalData = response.data.content;

                additionalData.forEach(live => {
                  Object.assign(live, { isPreviewing: false });
                }); // ispreviewing 필드 live에 추가 

                this.liveList = [...this.liveList, ...additionalData];
                this.isLastPage = response.data.last; // 라스트 여부
                this.isLoading = false; // 로딩 끝!
            } catch(e) {
                console.log(e);
            }
            console.log(this.currentPage);
        },
        scrollPagination() {
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if(isBottom && !this.isLastPage && !this.isLoading) {
                this.loadLive();
            }
        },
        // 라이브 시작하기 위해 title, 썸네일 추가하는 모달창
        async openModal() {
            try {
              const sellerId = localStorage.getItem('sellerId');          
              const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/seller/${sellerId}`);
              console.log(">>>>>>>>>>>>>> response : ", response.data);

              // 성공시 모달 open 
              this.startLiveDialog = true;
            } catch (error) {
              if (error.response && error.response.status === 404) {
                console.log('해당 id의 농장이 존재하지 않습니다. 농장 생성을 먼저 해주세요.');
                this.createFarmModal = true;
                // this.$router.push({ path: '/farm/farm-create' });
              } else {
                console.error('Farm 확인 중 오류 발생:', error);
              }
            }
        },
        routeToCreateFarm() {
          this.createFarmModal = false;
          this.$router.push({ path: '/farm/farm-create' });
        },
        cancelLive() {
            this.startLiveDialog = false;
            this.title = "";
            this.liveImage = "";
            this.category = "";
        },
        // 방송자: 라이브 시작
        async startLive() {
            if (this.title && this.liveImage && this.category) {
                const liveData = {
                    title: this.title,
                    liveImage: this.liveImage,
                    category: this.category
                };
                try {
                    const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions`, liveData, {
                        headers: {
                            'sellerId': localStorage.getItem('sellerId'),
                        },
                    });
                    console.log("라우팅 하기 직전 : ", response);

                    this.isPublisher = true;

                    // 세션 시작 후 LiveStream.vue로 이동
                    this.$router.push({
                        path: `/live/${response.data.sessionId}`,
                        query: { title: this.title, 
                                 isPublisher: true,
                                 farmName: response.data.farmName,
                                 profileImageUrl: response.data.profileImageUrl
                         }
                    });
                } catch (error) {
                    console.error('라이브 시작 오류:', error);
                }
            }
        },
        // 시청자: 기존 세션에 접속
        async joinExistingSession(liveId) {
          if (!this.isLoggedIn) {
                this.loginConfirmModalVisible = true;
                return;
            }
            console.log("시청자 세션 : ", liveId);
            this.isPublisher = false; // 시청자 설정
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${liveId}/sessionId`);
                console.log(response.data.sessionId);
                this.mySessionId = response.data.sessionId;
                console.log("join 세션id : ", this.mySessionId);

                // 세션 접속 후 LiveStream.vue로 이동
                this.$router.push({
                    path: `/live/${response.data.sessionId}`,
                    query: { title: response.data.title, 
                             isPublisher: false,
                             farmName: response.data.farmName,
                             profileImageUrl: response.data.profileImageUrl }
                });
            } catch (error) {
                console.error('세션 ID 가져오기 오류:', error);
            }
        },
        goToLogin() {
            this.loginConfirmModalVisible = false;
            this.$router.push('/member/sign-in');
        },
        // 목록 뿌려지자마자 1.5초 뒤에 전체 프리뷰 뿌려짐 
        async playPreviewAll() {
          for (const live of this.filteredLiveList) {
            if (!live.isPreviewing) {
              this.playPreview(live);
            }
          }
        },
        // 커서 올리면 영상 미리볼 수 있는 화면 출력  
        async playPreview(live) {
          console.log(">>>>>>>" + live.liveId + "번째 라이브 시작");
          try {
            live.isPreviewing = true;
            await this.$nextTick();

            const token = await this.getToken(live.sessionId);
            console.log(">>>>>>>>> token: " + token + " >>>>>>>>>> sessiongId" + live.sessionId);

            // const OV = new OpenVidu('https://api.inong.shop/openvidu');
            const OV = new OpenVidu();
            const session = OV.initSession();
            live.session = session; // 세션을 저장해 해제할 수 있도록 함 

            session.on('streamCreated', ({ stream }) => {
              const videoRef = this.$refs['videoPlayer-' + live.liveId];
              const videoElement = videoRef ? videoRef[0] : null;
              console.log(">>>>>>>>>video element: ", videoElement)

              if (videoElement) {
                const subscriber = session.subscribe(stream, undefined);
                subscriber.addVideoElement(videoElement);
              } else {
                console.warn('경고: Video element is not yet available for preview.');
              }
            });

            await session.connect(token, { clientData: 'Preview' }).then(() => {
              console.log("세션 연결됨 > Current connections: ", session.remoteConnections);
            }).catch(error => {
              console.error("세션 연결 실패:", error);
            });

          } catch (error) {
              console.error('영상 미리보기 오류:', error);
          }
      },
      async getToken(sessionId) {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${sessionId}/connections`);
          return response.data;
        } catch (error) {
          console.error('Error fetching token for preview:', error);
        }
      },
      stopAllPreviews() {
        for (const live of this.filteredLiveList) {
          if (live.isPreviewing) {
            live.isPreviewing = false;
            console.log(">>>>>" + live.liveId + "번째 라이브 중지");

            if (live.session) {
              live.session.disconnect();
              live.session = null;
            }
          }
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      this.stopAllPreviews();
      next();
    },
  }
</script>
<style scoped>
.start-btn {
    background-color: #BCC07B; 
    border-radius: 50px;
    float: right;
    margin-right: 30px;
}
.live-card-fav {
  border-radius: 50%;
  margin: 0%;
  padding: 0%;
}
.live-modal {
    height: 400px;
    padding: 18px;
}
.modal-action {
    display: flex;
    justify-content: flex-end;
    /* margin-top: 10px; */
    margin-right: 10px;
    padding-bottom: 5px;
}
.modal-btn {
    border-radius: 50px;
    margin-left: 10px; 
}
.viewer-count {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7); /* 배경을 반투명하게 설정 */
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    z-index: 1; /* 이미지를 덮도록 설정 */
} /* ☀️ */
.progress-border {
  position: relative;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  padding: 3px;
  background: linear-gradient(90deg, #BCC07B, #ffaf6e); 
  display: flex;
  align-items: center;
  justify-content: center;
  /* animation: rotate-border 5s linear infinite;  */
}
/* 사용 안됨 */
@keyframes rotate-border {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.inner-border {
  background-color: white; /* This simulates the gap between the border and the image */
  border-radius: 50%;
  padding: 5px; /* Adjust to control the gap size */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.live-image {
  border-radius: 50%;
  width: 90%;
  height: 90%;
  object-fit: cover;
}
.cat-btn {
  padding: 3px 10px;
  margin: 2px 3px;
  border-radius: 50px;
  box-shadow: none;
  border: 1px solid #cfcfcf;
}
.active-cat-btn {
  background-color: #d0d0d0;
}
.hr-style {
  border-bottom: 3px solid #efefef; border-radius: 3px;
}
.farm-card {
  text-align: center;
  padding: 8px;
  border-radius: 10px;
}
.farm-btn {
  background-color: #BCC07B;
  border-radius: 50px;
  box-shadow: none;
  width:230px;
}
.login-modal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
}
.login-modal-btn {
  margin-left: 2px;
  margin-top: -10px;
  border-radius: 50px;
  width: 50px;
  color: black;
}
</style>