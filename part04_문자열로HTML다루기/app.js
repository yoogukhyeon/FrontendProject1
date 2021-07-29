//2개화면 리팩토리 

const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';


//반복코드 getDate함수안에 ajax 코드를 넣고 url바뀔수 있어 인자 값에 url을 줍니다
function getDate(url){
    ajax.open('GET', url , false);
    ajax.send();

    //ajax.response 반환값 return
    return JSON.parse(ajax.response);
};

//ajax getDate 함수를 통해서 불러와서 코드를 줄인다
const newsFeed = getDate(NEWS_URL)
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  const id = location.hash.substr(1);

  
  const newsContent = getDate(CONTENT_URL.replace('@id' , id));
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title;

  content.appendChild(title);
});


//문자열로 html 만들기 되도록 DOM객체에 Element속성을 안쓰고 UI를 구성하는것이 효율적이고 좋음 
//지금은 연습이라서 코드를 계속 만들어보는것입니다!
for(let i = 0; i < 10; i++) {
    const div = document.createElement('div');

    div.innerHTML = `  
        <li>
            <a href="#${newsFeed[i].id}"> 
            ${newsFeed[i].title} (${newsFeed[i].comments_count})       
            </a>
        </li>
    `
    
    ul.appendChild(div.firstElementChild);


}

container.appendChild(ul);
container.appendChild(content);
