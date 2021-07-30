

const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store = {
    currentPage: 1,
}

//반복코드 getDate함수안에 ajax 코드를 넣고 url바뀔수 있어 인자 값에 url을 줍니다
function getDate(url){
    ajax.open('GET', url , false);
    ajax.send();

    //ajax.response 반환값 return
    return JSON.parse(ajax.response);
};

//ajax getDate 함수를 통해서 불러와서 코드를 줄인다

const ul = document.createElement('ul');

//문자열로 html 만들기 되도록 DOM객체에 Element속성을 안쓰고 UI를 구성하는것이 효율적이고 좋음 
//지금은 연습이라서 코드를 계속 만들어보는것입니다!

//templat 큰틀을 미리 만들기

//newfeed
function newsFeeds(){
    const newsFeed = getDate(NEWS_URL)   
    const newsList = [];

    //ui구현할 템클렛 생성
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
   
    for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++) {
        newsList.push(`  
        <div class="p-6 bg-white mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
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
    }

    template = template.replace('{{__news_feed__}}' , newsList.join(''));
    template = template.replace('{{__prev_page__}}' , store.currentPage > 1 ? store.currentPage -1 : 1);
    template = template.replace('{{__next_page__}}' , store.currentPage + 1);

    container.innerHTML = template
}



//newsdetail 
function newsDetail(){
        const id = location.hash.substr(7);
        const newsContent = getDate(CONTENT_URL.replace('@id' , id));

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

      //댓글 함수 만들기
      function makeComments(comments , called = 0){
          const commentString = [];

        for(let i = 0; i < comments.length; i++){
          commentString.push(`
          <div style="padding-left: ${called * 40}40px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>  
          `);
          
          if(comments[i].comments.length > 0){
              commentString.push(makeComments(comments[i].comments, called + 1))
          }
        }

        return commentString.join('');
      }  
        container.innerHTML = template.replace('{{__comments__}}' , makeComments(newsContent.comments))
      
}



//router 
function router(){
    const routerPath = location.hash;

    if(routerPath === ""){
        newsFeeds();
    }else if(routerPath.indexOf('#/page/') >= 0){
        store.currentPage = Number(routerPath.substr(7));
        newsFeeds();
    }else{
        newsDetail();
    }
}

window.addEventListener('hashchange', router)
router();