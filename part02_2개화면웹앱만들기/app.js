//html에서 container 태그를 가져옴
const container = document.getElementById('root');
//서버 통신을 위해서 XMLHttpRequest() 변수 ajax 담는다 
const ajax = new XMLHttpRequest();

//div 생성 나중에 지울 코드
const div = document.createElement('div')
//URL 변수에 담기
const NEW_URL = '	https://api.hnpwa.com/v0/news/1.json'; 
const NEWS_CONTENT = 'https://api.hnpwa.com/v0/item/@id.json';
ajax.open('GET' , NEW_URL , false)
ajax.send();

const newsFeed = JSON.parse(ajax.response);

//createElement 생성 
const ul = document.createElement('ul');

//hash 체인지 이벤트함수 만들기
window.addEventListener('hashchange' , function(){
    //hash 자리에 substr 메소드를 이용해서 특정 문자를 컨트롤! @id에서 start 1번 문자 @ 없애는것
    const id = location.hash.substr(1);
    ajax.open('GET' , NEWS_CONTENT.replace('@id' , id) , false);
    ajax.send();

    const newsContent = JSON.parse(ajax.response);

    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;

    div.appendChild(title)

})

for(let i = 0; i < 10; i++){
    const li = document.createElement('li');
    //a 태그 만들기
    const a = document.createElement('a');

    //a 속성 값넣고 #뒤에 newsFeed.id 값을 해쉬태그를 이용해서 페이지 이동
    a.href = `#${newsFeed[i].id}`;
    a.innerHTML = `${newsFeed[i].title}`;
    
    //li엘리먼트에 a를 자식요속로 넣기
    li.appendChild(a);
    ul.appendChild(li);
}


container.appendChild(ul)
container.appendChild(div)