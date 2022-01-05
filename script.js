const posts = document.getElementById ("posts");

const postsURL = 'https://jsonplaceholder.typicode.com/posts';
const authorURL = 'https://jsonplaceholder.typicode.com/users';

function getData(url) {
   return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open("GET", url);
      xhr.responseType = 'json';
   
      xhr.onload = () => {
         if(xhr.status >= 400) {
            reject(xhr.response);
         } else {
            resolve(xhr.response);
         }
      }

      xhr.onerror = () => reject(xhr.response)
      
      xhr.send()
   })
}

getData(postsURL)
   .then(data => {
      let users = data.filter(item => item.id < 11);
      return users
   })
   .then(data => {
         data.forEach(item => {
            posts.innerHTML += `<div class="post">
            <div class="post__title">
            ${item.title}
            </div>
            <span class = "author-link">Get author</span>
         </div>`
         });
         
         return data
   })
   .then(() => {
      let buttons = document.querySelectorAll('.author-link');
      for(let i = 0; i < buttons.length; i++) {
         buttons[i].addEventListener('click', () => getUserInfo(i))
      }
   });

function getUserInfo(index) {
   return getData(authorURL).then(data => {
      // console.log(data);
      let userNames = data.map(item => item.name);
      console.log(userNames)
      return userNames;
   }).then(names => {
      let posts = document.querySelectorAll(".post");
      return getData(postsURL)
         .then(data => {
            return data.reduce((acc,item) => {
               if(!acc[item.userId]) {
                  acc[item.userId] = 1
               } else {
                  acc[item.userId] += 1
               }
               return acc;
            }, {})
         }).then(data => {
            posts[index].innerHTML += `
         <div class = "author-name">${names[index]}</div>
         <div class = "author-name">Amount of posts: ${Object.values(data)[index]}</div>
      `
         });
   })
}