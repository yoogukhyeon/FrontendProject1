//중복된 코드를 리팩토리 

//html에서 container 태그를 가져옴
const container = document.getElementById('root');
//서버 통신을 위해서 XMLHttpRequest() 변수 ajax 담는다 
const ajax = new XMLHttpRequest();

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

//공유할수있는 변수설정
const store = {
    currentPage: 1,
    feeds: [],
}

//중복되는 AJAX 함수를 만들기 바뀌는 부분은 URL 밖에 없기 떄문에 인자로 URL 넣고 호출할떄마다 URL 바꿔준다
function getDate(URL){
    //ajax 통신 open , send , response
    //ajx.open('method 방식' , 'api url' , 비동기통신 안한다는뜻입니다)
    ajax.open('GET' , URL  , false)
    ajax.send();
    //JOSON 형태로 return 값을 받는다
    return JSON.parse(ajax.response);
 
};

function makeFeeds(feeds){
    for(let i = 0; i < feeds.length; i++){
      feeds[i].read = false;
    }
    return feeds;
};

//div 생성
const Content = document.createElement('div');

//createElement 생성 
const ul = document.createElement('ul');


function newsFeed(){
    let newsFeed = store.feeds;

    const newsList = [];

    // 템플렛 큰틀을 만들어서 UI 배치
    let template = `
        <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
        <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
                </a>
            </div>
            </div> 
        </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
        </div>
    </div>
    `;

    if(newsFeed.length === 0){
      newsFeed = store.feeds = makeFeeds(getDate(NEWS_URL))
    }

   

    //for문으로 먼저 10의 title값을 가져오기
    //문자열로 html 만들기 되도록 DOM객체에 Element속성을 안쓰고 UI를 구성하는것이 효율적이고 좋음
    for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++){
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
            <div class="flex">
            <div class="flex-auto">
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
            </div>
            <div class="text-center text-sm">
                <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
            </div>
            </div>
            <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
                <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
            </div>  
            </div>
        </div>  
        `);
    };

    //삼합연산자로 page 1에서 0으로 안되게 했습니다


    template = template.replace('{{__news_feed__}}' , newsList.join(''));
    template = template.replace('{{__prev_page__}}' , store.currentPage > 1 ? store.currentPage -1 : 1);
    template = template.replace('{{__next_page__}}' , store.currentPage + 1);

    // join() 메서드는 배열의 모든 요소를 연결해 하나의 문자열로 만듭니다.
    container.innerHTML = template
}

function newsDetail(){
    //newsContent API url 보면 @id 부분에 @지우기 위해 substr 썻다
    const id = location.hash.substr(7);
    console.log('hash 변경됨');

    //hash 값을 구하기위해서 replace 메소드를 속성을 써거 첫번쨰 인자를 두번쨰 인자로 바꾼다.
    const newsContent = getDate(CONTENT_URL.replace('@id', id));
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/${store.currentPage}" class="text-gray-500">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full border rounded-xl bg-white m-6 p-4 ">
      <h2>${newsContent.title}</h2>
      <div class="text-gray-400 h-20">
        ${newsContent.content}
      </div>

      {{__comments__}}

    </div>
  </div>
    `;

    for(let i = 0; i < store.feeds.length; i++){
      if(store.feeds[i].id === Number(id)){
        store.feeds[i].read = true;
        break;
      }
    }


    //댓글 함수

    function makeComment(comments , called = 0){
        const commentString = [];

        for(let i = 0; i < comments.length; i++){
            commentString.push(`
            <div style="padding-left: ${called * 40}px;" class="mt-4">
            <div class="text-gray-400">
              <i class="fa fa-sort-up mr-2"></i>
              <strong>${comments[i].user}</strong> ${comments[i].time_ago}
            </div>
            <p class="text-gray-700">${comments[i].content}</p>
          </div>  
            `);
            if(comments[i].comments.length > 0){
                commentString.push(makeComment(comments[i].comments , called + 1));
            }
        }


        return commentString.join('');
    }
    //문자열 만들기
    container.innerHTML = template.replace('{{__comments__}}' , makeComment(newsContent.comments));
}




//라우터 생성 hash 없을때는 newsFeed() 있으면 newDetail();
function router(){
    const routerPath = location.hash;

    if(routerPath === ""){
        newsFeed();
    }else if(routerPath.indexOf('#/page/') >= 0){
        store.currentPage = Number(routerPath.substr(7))
        newsFeed();
    }else{
        newsDetail();
    }
}

//hash event 생성
//hashchange 이벤트는 같은 페이지 안에서 해시(#)만 바뀌었을 때, 즉 페이지에서 id가 있는 요소로 이동하게 하기위해서 hash를 쓴다 
window.addEventListener('hashchange' , router);
router();


