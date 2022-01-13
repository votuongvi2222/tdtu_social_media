
var startIndex = 0, startIndexNoti = 0, loadMore = false, count_cmts = 0, count_stds = 0, count_posts = 0
var limit = 10
const socket = io();
toastr.options = {
    timeOut: 10000,
    positionClass : 'toast-bottom-right',
    extendedTimeOut: 0,
    fadeOut: 0,
    fadeIn: 0,
    showDuration: 0,
    hideDuration: 0,
    debug: false
};

socket.on('new-notification', (resp) => {
  toastr.success(resp, 'New notification')
});

function sendMessage(depName) {
  let msg = depName + ' has a new notification!'
  socket.emit("send-notification", msg);
}
var getComments = function(pid){
  var contentHtml = ''
  var count = 0;
  $.ajax({
    async: false,
    url: "/api/v1/comments/post/"+pid,
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      var temp = '', box = '', link = ''
      var commentData = response
      count = commentData.length
      for (var i = 0; i < count; i++) {
        if($('#account_id').val() == commentData[i].account.id || $('#account_roleId').val() == 3 ){
          box += 
          `
          <div class="update_comment-svg dropdown">
              <button  data-toggle="dropdown">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
              </button>
              <ul class="dropdown-menu">
                  <li class="edit_cmt" onclick="openEditCmt(this)"><button class="dropdown-item" type="button">Edit</button></li>
                  <li class="del_cmt" onclick="deleteCmt(this)"><button class="dropdown-item" type="button">Delete</button></li>
              </ul>
          </div>
          `
        } 
        if(commentData[i].account.roleId == 1){
          link = 
          `<a href="/${commentData[i].account.username}.${commentData[i].account.id}">
            <img src="${commentData[i].account.avatar}" alt="avatar" class="avatar">
          </a>`
        }
        else{
          link = 
          `
            <img src="${commentData[i].account.avatar}" alt="avatar" class="avatar">
          `
        }
        
        
        temp += `
        <li id="${commentData[i].id}" class="list-group-item list-comment row">
            <div class="card-header post-box-header comment-list-item-header">
              ${link}
              <div class="post-detail">
                  <footer class="blockquote-footer">
                      <small class="text-muted">
                          <cite title="Source Title">${commentData[i].account.username}</cite>
                          <span>${commentData[i].createdTime}</span>
                      </small>
                      <div class="list-comment-content-item">${commentData[i].content}</div>
                  </footer>
              </div>
            </div>
            ${box}
        </li>`
      }
      contentHtml = temp
    }
  });
  return [contentHtml, count];
};
function getPostsByAccInRange(accountId){
  $.ajax({
    url: "/api/v1/posts/acc/"+$('#personal_id').val()+"/"+startIndex+"/"+limit,
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      console.log(response)

      let contentHtml = '', box = '', link = ''
      var postData = response
      
      for (var i = 0; i < postData.length; i++) {
        const [commentData, commentNum] = getComments(postData[i].id);
        // check owner
        if($('#account_id').val() == postData[i].account.id || $('#account_roleId').val() == 3){
          box = 
          `
          <div class="post-alter-icon dropdown">
              <button  data-toggle="dropdown">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
              </button>
              <ul class="dropdown-menu">
                <li class="edit_post" onclick="openEditPost(this)"><button class="dropdown-item" type="button">Edit</button></li>
                <li class="del_post" onclick="deletePost(this)"><button class="dropdown-item" type="button">Delete</button></li>
              </ul>
          </div>
          `
        } 
        if(postData[i].account.roleId == 1){
          link = 
          `<a href="/${postData[i].account.username}.${postData[i].account.id}">
            <img src="${postData[i].account.avatar}" alt="avatar" class="avatar">
          </a>`
        }
        else{
          link = 
          `
            <img src="${postData[i].account.avatar}" alt="avatar" class="avatar">
          `
        }
        
        var mediaContent = ''
        if(postData[i].images.length > 0){
          mediaContent =
          `
          <div class="post_image rounded row">
            <div>
                <a href="#" data-toggle="modal" data-target="#${postData[i].images[0]}">
                    <img class="rounded mx-auto d-block" src="${postData[i].images[0]}" alt="" srcset="">
                </a>
                <div class="modal fade" id="${postData[i].images[0]}" tabindex="-1" role="dialog" aria-labelledby="${postData[i].images[0]}" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span  aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <img class="rounded mx-auto d-block" src="${postData[i].images[0]}" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          `
        } else if (postData[i].videoLinks.length > 0){
          mediaContent = 
          `
          <div class="embed-responsive embed-responsive-16by9 ">
            <iframe class="rounded mx-auto d-block" src="${postData[i].videoLinks[0].replace('watch?v=', 'embed/')}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          `
        }
        contentHtml += 
        `
        <div id="${postData[i].id}" class="stream-box">
          <div class="post-box">
              <div class="card post-box-card">
                  <div class="card-header post-box-header row">
                      <div class="card-header-left col-md-6">
                          ${link}
                          <div class="post-detail">
                              <footer class="blockquote-footer">
                                  <small class="text-muted">
                                      <cite title="Source Title">${postData[i].account.username}</cite>
                                      <p>${postData[i].createdTime}</p>
                                  </small>
                              </footer>
                          </div>
                      </div>
                      <div class="card-header-right col-md-6">
                          ${box}
                          <div class="overal-post-info-box">
                              <span class="reply">
                                  <small>
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-square-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5a2 2 0 0 1 1.6.8L8 14.333 9.9 11.8a2 2 0 0 1 1.6-.8H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                          <path fill-rule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                      </svg>
                                      <span class="num_reply">${commentNum}</span> REPLIES
                                  </small>
                              </span>
                              <span class="like">
                                  <small>
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd"
                                              d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z">
                                          </path>
                                      </svg>
                                      ${postData[i].likers.length}
                                  </small>
                              </span>
                          </div>
                      </div>
                  </div>
                  <div class="card-body">
                      <p class="card-text"> ${postData[i].caption}</p>
                      ${mediaContent}
                      <span class="react_icon position-absolute top-0 start-100 p-2 bg-light border border-light rounded-circle">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"> </path>
                          </svg>
                      </span>
                  </div>
              </div>
          </div>
          <div class="comment-box comment-box-list">
              <ul class="list-group comment-list-group list-group-flush">
                  ${commentData}
              </ul>
          </div>
          <form>
              <div class="comment-box comment-box-active">
                  <img src="${$('#account_avatar').val()}" alt="avatar" class="avatar hidden-xs"> 
                  <textarea class="comment-input col-9" name="comment-content" placeholder="Comment here..." cols="1" rows="1" required></textarea>
                  <button name="post-public-comment-btn" class="post-comment-btn col-1" onclick="submitCommet(this); return false;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
                      </svg>
                  </button>
              </div>
          </form>
        </div>
        `;
        
      }
      document.getElementById("posts_data").innerHTML += contentHtml;
      startIndex += limit
    }
  });
}
function getPostsInRange(){
  $.ajax({
    url: "/api/v1/posts/"+startIndex+"/"+limit,
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      console.log('start')
      console.log(startIndex)

      let contentHtml = '', box = '', link = ''
      var postData = response
      startIndex += postData.length

      for (var i = 0; i < postData.length; i++) {
        const [commentData, commentNum] = getComments(postData[i].id);
        // check owner
        if($('#account_id').val() == postData[i].account.id || $('#account_roleId').val() == 3){
          box = 
          `
          <div class="post-alter-icon dropdown">
              <button  data-toggle="dropdown">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
              </button>
              <ul class="dropdown-menu">
                <li class="edit_post" onclick="openEditPost(this)"><button class="dropdown-item" type="button">Edit</button></li>
                <li class="del_post" onclick="deletePost(this)"><button class="dropdown-item" type="button">Delete</button></li>
              </ul>
          </div>
          `
        } 
        if(postData[i].account.roleId == 1){
          link = 
          `<a href="/${postData[i].account.username}.${postData[i].account.id}">
            <img src="${postData[i].account.avatar}" alt="avatar" class="avatar">
          </a>`
        } else{
          link = 
          `
            <img src="${postData[i].account.avatar}" alt="avatar" class="avatar">
          `
        }
        var mediaContent = ''
        if(postData[i].images.length > 0){
          mediaContent =
          `
          <div class="post_image rounded row">
            <div>
                <a href="#" data-toggle="modal" data-target="#${postData[i].images[0]}">
                    <img class="rounded mx-auto d-block" src="${postData[i].images[0]}" alt="" srcset="">
                </a>
                <div class="modal fade" id="${postData[i].images[0]}" tabindex="-1" role="dialog" aria-labelledby="${postData[i].images[0]}" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span  aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <img class="rounded mx-auto d-block" src="${postData[i].images[0]}" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          `
        } else if (postData[i].videoLinks.length > 0){
          mediaContent = 
          `
          <div class="embed-responsive embed-responsive-16by9 ">
            <iframe class="rounded mx-auto d-block" src="${postData[i].videoLinks[0].replace('watch?v=', 'embed/')}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          `
        }
        contentHtml += 
        `
        <div id="${postData[i].id}" class="stream-box">
          <div class="post-box">
              <div class="card post-box-card">
                  <div class="card-header post-box-header row">
                      <div class="card-header-left col-md-6">
                          ${link}
                          <div class="post-detail">
                              <footer class="blockquote-footer">
                                  <small class="text-muted">
                                      <cite title="Source Title">${postData[i].account.username}</cite>
                                      <p>${postData[i].createdTime}</p>
                                  </small>
                              </footer>
                          </div>
                      </div>
                      <div class="card-header-right col-md-6">
                          ${box}
                          <div class="overal-post-info-box">
                              <span class="reply">
                                  <small>
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-square-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5a2 2 0 0 1 1.6.8L8 14.333 9.9 11.8a2 2 0 0 1 1.6-.8H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                          <path fill-rule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                      </svg>
                                      <span class="num_reply">${commentNum}</span> REPLIES
                                  </small>
                              </span>
                              <span class="like">
                                  <small>
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd"
                                              d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z">
                                          </path>
                                      </svg>
                                      ${postData[i].likers.length}
                                  </small>
                              </span>
                          </div>
                      </div>
                  </div>
                  <div class="card-body">
                      <p class="card-text"> ${postData[i].caption}</p>
                      ${mediaContent}
                      <span class="react_icon position-absolute top-0 start-100 p-2 bg-light border border-light rounded-circle">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"> </path>
                          </svg>
                      </span>
                  </div>
              </div>
          </div>
          <div class="comment-box comment-box-list">
              <ul class="list-group comment-list-group list-group-flush">
                  ${commentData}
              </ul>
          </div>
          <form>
              <div class="comment-box comment-box-active">
                  <img src="${$('#account_avatar').val()}" alt="avatar" class="avatar hidden-xs"> 
                  <textarea class="comment-input col-9" name="comment-content" placeholder="Comment here..." cols="1" rows="1" required></textarea>
                  <button name="post-public-comment-btn" class="post-comment-btn col-1" onclick="submitCommet(this); return false;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
                      </svg>
                  </button>
              </div>
          </form>
        </div>
        `;
        
      }
      document.getElementById("posts_data").innerHTML += contentHtml;
    }
  });
}
function addNewPost(accountId, caption, videos, images){

  $.ajax({
    url: "/api/v1/post/",
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify({
      "accountId": accountId,
      "caption": caption,
      "images": images,
      "videoLinks": videos
    }),
    success: function(response){
      console.log(response)
      let contentHtml = ''
      var postData = response
      var mediaContent = ''
      if(postData.images.length > 0){
        mediaContent =
        `
        <div class="post_image rounded row">
          <div>
              <a href="#" data-toggle="modal" data-target="#${postData.images[0]}">
                  <img class="rounded mx-auto d-block" src="${postData.images[0]}" alt="" srcset="">
              </a>
              <div class="modal fade" id="${postData.images[0]}" tabindex="-1" role="dialog" aria-labelledby="${postData.images[0]}" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span  aria-hidden="true">&times;</span>
                              </button>
                          </div>
                          <div class="modal-body">
                              <img class="rounded mx-auto d-block" src="${postData.images[0]}" alt="" srcset="">
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        `
      } else if (postData.videoLinks.length > 0){
        mediaContent = 
        `
        <div class="embed-responsive embed-responsive-16by9 ">
          <iframe class="rounded mx-auto d-block" src="${postData.videoLinks[0].replace('watch?v=', 'embed/')}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        `
      }
      contentHtml += 
      `
      <div id="${postData.id}" class="stream-box">
        <div class="post-box">
            <div class="card post-box-card">
                <div class="card-header post-box-header row">
                    <div class="card-header-left col-md-6">
                        <img src="${postData.account.avatar}" alt="avatar" class="avatar">
                        <div class="post-detail">
                            <footer class="blockquote-footer">
                                <small class="text-muted">
                                    <cite title="Source Title">${postData.account.username}</cite>
                                    <p>${postData.createdTime}</p>
                                </small>
                            </footer>
                        </div>
                    </div>
                    <div class="card-header-right col-md-6">
                        <div class="post-alter-icon dropdown">
                            <button  data-toggle="dropdown">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                </svg>
                            </button>
                            <ul class="dropdown-menu">
                                <li><button class="dropdown-item" type="button">Edit</button></li>
                                <li><button class="dropdown-item" type="button">Delete</button></li>
                            </ul>
                        </div>
                        <div class="overal-post-info-box">
                            <span class="reply">
                                <small>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-square-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5a2 2 0 0 1 1.6.8L8 14.333 9.9 11.8a2 2 0 0 1 1.6-.8H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                        <path fill-rule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                    <span class="num_reply">0</span> REPLIES
                                </small>
                            </span>
                            <span class="like">
                                <small>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z">
                                        </path>
                                    </svg>
                                    0
                                </small>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text"> ${postData.caption}</p>
                    ${mediaContent}
                    <span class="react_icon position-absolute top-0 start-100 p-2 bg-light border border-light rounded-circle">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"> </path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
        <div class="comment-box comment-box-list">
            <ul class="list-group comment-list-group list-group-flush">

            </ul>
        </div>
        <form>
            <div class="comment-box comment-box-active">
                <img src="${postData.account.avatar}" alt="avatar" class="avatar hidden-xs">
                <textarea class="comment-input col-9" name="comment-content" placeholder="Comment here..." cols="1" rows="1" required></textarea>
                <button name="post-public-comment-btn" class="post-comment-btn col-1"  onclick="submitCommet(this); return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
                    </svg>
                </button>
            </div>
        </form>
      </div>
      `;

      document.getElementById("posts_data").innerHTML = contentHtml + document.getElementById("posts_data").innerHTML;
      startIndex += limit
      count_posts += 1
      document.getElementById("count_posts").innerHTML = count_posts;

  }})
}
function addNewCommentToPost(postId, accountId, content){
  console.log('comment')
  $.ajax({
    url: "/api/v1/comment/",
    type: "POST",
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      "accountId": accountId,
      "content": content,
      "postId": postId
    }),
    success: function(response){
      var link = ''
      if(response.account.roleId == 1){
        link = 
        `<a href="/${response.account.username}.${response.account.id}">
          <img src="${response.account.avatar}" alt="avatar" class="avatar">
        </a>`
      }
      else{
        link = 
        `
        <img src="${response.account.avatar}" alt="avatar" class="avatar">
        `
      }
      
      var contentHtml = 
      `
      <li id="${response.id}" class="list-group-item list-comment row">
          <div class="card-header post-box-header comment-list-item-header">
              ${link}
              <div class="post-detail">
                  <footer class="blockquote-footer">
                      <small class="text-muted">
                          <cite title="Source Title">${response.account.username}</cite>
                          <span>${response.createdTime}</span>
                      </small>
                      <div class="list-comment-content-item">${response.content}</div>
                  </footer>
              </div>
          </div>
          <div class="update_comment-svg dropdown">
              <button  data-toggle="dropdown">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
              </button>
              <ul class="dropdown-menu">
                  <li class="edit_cmt" onclick="openEditCmt(this)"><button class="dropdown-item" type="button">Edit</button></li>
                  <li class="del_cmt" onclick="deleteCmt(this)"><button class="dropdown-item" type="button">Delete</button></li>
              </ul>
          </div>
      </li>
      `
      $('#'+postId).find('.comment-list-group').prepend(contentHtml)
      var currReply = parseInt($('#'+postId).find('.num_reply').text())
      $('#'+postId).find('.num_reply').text(currReply + 1)
      count_cmts += 1
      document.getElementById("count_cmts").innerHTML = count_cmts;
    }
  })
}
function submitCommet(el){
  var postId = $(el).parents('.stream-box').attr('id')
  var content = $(el).prev('.comment-input').val()
  addNewCommentToPost(postId, $('#account_id').val(), content)
  return false;
}
var getNotisByTopic = function(topicId, topicTitle){
  var contentHtmlPer = ''
  $.ajax({
    async: false,
    url: "/api/v1/notifications/topic/"+topicId,
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      // console.log('notipper')
      // console.log(response)
      var temp = ''
      var notiData = response
      for (var i = 0; i < notiData.length; i++) {
        temp +=
        `
        <div class="card noti-item" id="topic_${notiData[i].id}">
            <div class="card-header" id="topic_noti_heading-${notiData[i].id}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left noti-label" type="button" data-toggle="collapse" data-target="#topic_noti-${notiData[i].id}" aria-expanded="true" aria-controls="topic_noti-${notiData[i].id}">
                        ${notiData[i].department.name}:${notiData[i].title}
                    </button>
                </h2>
            </div>

            <div id="topic_noti-${notiData[i].id}" class="collapse noti-content" aria-labelledby="topic_noti_heading-${notiData[i].id}" data-parent="#topic_notiStream-${topicId}">
                <div class="card-body">
                    <div class="shorten-post-content">
                      ${notiData[i].content}
                    </div>
                    <footer class="blockquote-footer">
                        <small class="text-muted">
                            <cite title="Source Title">${notiData[i].publishDate}</cite>
                        </small>
                        <div class="post-link">
                            <a role="button" id="topic_noti_open-${notiData[i].id}" data-toggle="modal" data-target="#topic_myModal-${notiData[i].id}">Learn more</a>
                            <div class="modal fade modal-fullscreen" id="topic_myModal-${notiData[i].id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="topic_staticBackdropLabel-${notiData[i].id}" aria-hidden="true">
                                <div class="modal-dialog">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5 class="modal-title" id="topic_staticBackdropLabel-${notiData[i].id}">${notiData[i].title}</h5>
                                    </div>
                                    <div class="modal-body">
                                    ${notiData[i].content}
                                    </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        `
      }
      contentHtmlPer += 
        `<div class="card">
            <div class="card-header" id="topic_heading-${topicId}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left topic-label" type="button" data-toggle="collapse" data-target="#topic-${topicId}" aria-expanded="true" aria-controls="topic-${topicId}">
                      ${topicTitle}
                    </button>
                </h2>
            </div>

            <div id="topic-${topicId}" class="collapse" aria-labelledby="topic_heading-${topicId}" data-parent="#topic_container">
                <div class="card-body" id="topic_notiStream-${topicId}">
                    ${temp}
                </div>
            </div>
        </div>`
        // console.log(temp)
      

    },
    error: function(err){
      console.log(err)
    }
  });
  return contentHtmlPer
}
function getTopics(){
  $.ajax({
    url: "/api/v1/topics/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      let contentHtml = '', contentHtmlPer = ''
      var topicData = response
      
      for (var i = 0; i < topicData.length; i++) {
        contentHtml += 
        `
        <button class="btn btn-link btn-block text-left topic-label" type="button" data-toggle="collapse" data-target="#topic-${topicData[i].id}" aria-expanded="true" aria-controls="topic-${topicData[i].id}">
        ${topicData[i].name}
        </button>
        `
        contentHtmlPer += getNotisByTopic(topicData[i].id, topicData[i].name)

      }
      document.getElementById("topicPanel").innerHTML += contentHtml;
      document.getElementById("topic_container").innerHTML += contentHtmlPer;
    }
  });
}

function getAllDemoTopics(){
  $.ajax({
    url: "/api/v1/topics/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      let contentHtml = ''
      var topicData = response
      
      for (var i = 0; i < topicData.length; i++) {
        contentHtml += 
        `
          <a href="/noti" class="tag-cloud-link topic_tag-link">${topicData[i].name}</a>
        `
      }
      document.getElementById("demo_tag-list").innerHTML += contentHtml;
    }
  });
}

function loadTopicOptions(){
  $.ajax({
    url: "/api/v1/topics/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      let contentHtml = ''
      var topicData = response
      
      for (var i = 0; i < topicData.length; i++) {
        contentHtml += 
        `
          <option value="${topicData[i].id}" >${topicData[i].name}</option>
        `
      }
      document.getElementById("category").innerHTML += contentHtml;
    }
  });
}

var getNotisByDepartment = function(id, depId, depName){
  var contentHtmlPer = ''
  $.ajax({
    async: false,
    url: "/api/v1/notifications/department/"+depId,
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      // console.log('notipper')
      // console.log(response)
      var temp = ''
      var notiData = response
      for (var i = 0; i < notiData.length; i++) {
        temp +=
        `
        <div class="card noti-item" id="department_${notiData[i].id}">
            <div class="card-header" id="department_noti_heading-${notiData[i].id}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left noti-label" type="button" data-toggle="collapse" data-target="#department_noti-${notiData[i].id}" aria-expanded="true" aria-controls="department_noti-${notiData[i].id}">
                        ${notiData[i].department.name}:${notiData[i].title}
                    </button>
                </h2>
            </div>

            <div id="department_noti-${notiData[i].id}" class="collapse noti-content" aria-labelledby="department_noti_heading-${notiData[i].id}" data-parent="#department_notiStream-${id}">
                <div class="card-body">
                    <div class="shorten-post-content">
                      ${notiData[i].content}
                    </div>
                    <footer class="blockquote-footer">
                        <small class="text-muted">
                            <cite title="Source Title">${notiData[i].publishDate}</cite>
                        </small>
                        <div class="post-link">
                            <a role="button" id="department_noti_open-${notiData[i].id}" data-toggle="modal" data-target="#department_myModal-${notiData[i].id}">Learn more</a>
                            <div class="modal fade modal-fullscreen" id="department_myModal-${notiData[i].id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="department_staticBackdropLabel-${notiData[i].id}" aria-hidden="true">
                                <div class="modal-dialog">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5 class="modal-title" id="department_staticBackdropLabel-${notiData[i].id}">${notiData[i].title}</h5>
                                    </div>
                                    <div class="modal-body">
                                    ${notiData[i].content}
                                    </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        `
      }
      contentHtmlPer += 
        `<div class="card">
            <div class="card-header" id="department__heading-${id}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left topic-label" type="button" data-toggle="collapse" data-target="#department-${id}" aria-expanded="true" aria-controls="department-${id}">
                      ${depName}
                    </button>
                </h2>
            </div>

            <div id="department-${id}" class="collapse" aria-labelledby="department_heading-${id}" data-parent="#department_container">
                <div class="card-body" id="department_notiStream-${id}">
                    ${temp}
                </div>
            </div>
        </div>`
        // console.log(temp)
      

    },
    error: function(err){
      console.log(err)
    }
  });
  return contentHtmlPer
}
function getDepartments(){
  $.ajax({
    url: "/api/v1/departments/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      let contentHtml = '', contentHtmlPer = ''
      var departmentData = response
      
      for (var i = 0; i < departmentData.length; i++) {
        contentHtml += 
        `
        <button class="btn btn-link btn-block text-left topic-label" type="button" data-toggle="collapse" data-target="#department-${departmentData[i].id}" aria-expanded="true" aria-controls="department-${departmentData[i].id}">
        ${departmentData[i].name}
        </button>
        `
        contentHtmlPer += getNotisByDepartment(departmentData[i].id, departmentData[i].code, departmentData[i].name)

      }
      document.getElementById("depPanel").innerHTML += contentHtml;
      document.getElementById("department_container").innerHTML += contentHtmlPer;
    }
  });
}
function getNotificationsInRange(){
  $.ajax({
    url: "/api/v1/notifications/"+startIndex+"/"+limit,
    type: "GET",
    contentType: 'application/json',
    success: function(response){

      let contentHtml = ''
      var notiData = response
      
      for (var i = 0; i < notiData.length; i++) {
        contentHtml += 
        `
        <div class="card noti-item" id="${notiData[i].id}">
            <div class="card-header" id="noti_heading-${notiData[i].id}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left noti-label" type="button" data-toggle="collapse" data-target="#noti-${notiData[i].id}" aria-expanded="true" aria-controls="noti-${notiData[i].id}">
                        ${notiData[i].department.name}:${notiData[i].title}
                    </button>
                </h2>
            </div>

            <div id="noti-${notiData[i].id}" class="collapse noti-content" aria-labelledby="noti_heading-${notiData[i].id}" data-parent="#notiStream">
                <div class="card-body">
                    <div class="shorten-post-content">
                      ${notiData[i].content}
                    </div>
                    <footer class="blockquote-footer">
                        <small class="text-muted">
                            <cite title="Source Title">${notiData[i].publishDate}</cite>
                        </small>
                        <div class="post-link">
                            <a role="button" id="noti_open-${notiData[i].id}" data-toggle="modal" data-target="#myModal-${notiData[i].id}">Learn more</a>
                            <div class="modal fade modal-fullscreen" id="myModal-${notiData[i].id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel-${notiData[i].id}" aria-hidden="true">
                                <div class="modal-dialog">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5 class="modal-title" id="staticBackdropLabel-${notiData[i].id}">${notiData[i].title}</h5>
                                    </div>
                                    <div class="modal-body">
                                    ${notiData[i].content}
                                    </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
        `
        
      }
      document.getElementById("notiStream").innerHTML += contentHtml;
      startIndex += limit
    }
  });
}
function getAllDemoNotis(){
  $.ajax({
    url: "/api/v1/notifications/"+startIndexNoti+"/"+limit,
    type: "GET",
    contentType: 'application/json',
    success: function(response){

      let contentHtml = ''
      var notiData = response
      
      for (var i = 0; i < notiData.length; i++) {
        contentHtml += 
        `
        <a href="/noti" class="noti_link">
          <li class="related-item todo-list-item">
              <div class="notice_info-div">
                  <div class="notice_author-div notice_info-item">
                      <small>[${notiData[i].department.name}]</small>
                  </div>
                  <div class="public_date-div notice_info-item">
                      <small>${notiData[i].publishDate.split(',')[1]}</small>
                  </div>
              </div>
              <div class="sidebar-box notice-item">
                  <h3>${notiData[i].title}</h3>
              </div>
          </li>
        </a>
        `
        
      }
      document.getElementById("demo_noti-list").innerHTML += contentHtml;
      startIndexNoti += limit
    }
  });
}
function getAllDemoNotisPerDep(){
  $.ajax({
    url: "/api/v1/notifications/department/"+$('#department_code').val(),
    type: "GET",
    contentType: 'application/json',
    success: function(response){

      let contentHtml = ''
      var notiData = response
      
      for (var i = 0; i < notiData.length; i++) {
        contentHtml += 
        `
        <a href="/noti" class="noti_link">
          <li class="related-item todo-list-item">
              <div class="notice_info-div">
                  <div class="notice_author-div notice_info-item">
                      <small>[${notiData[i].department.name}]</small>
                  </div>
                  <div class="public_date-div notice_info-item">
                      <small>${notiData[i].publishDate.split(',')[1]}</small>
                  </div>
              </div>
              <div class="sidebar-box notice-item">
                  <h3>${notiData[i].title}</h3>
              </div>
          </li>
        </a>
        `
        
      }
      document.getElementById("demo_noti_dep-list").innerHTML += contentHtml;
    }
  });
}
function openEditCmt(el){
  $('#cmt_modal').show();
  var cmt = $(el).parents('.list-comment')[0]
  var currContent = $('#'+ $(cmt).attr('id')).find('.list-comment-content-item')[0]
  $('#cmtId').val($(cmt).attr('id'))
  $('#cmt').val($(currContent).text())
}
function updateComment(){
  var id = $('#cmtId').val()
  var cmt = $('#'+id).find('.list-comment-content-item')[0]
  var content = $('#cmt').val()
  $.ajax({
    url: "/api/v1/comment/"+id,
    type: "PUT",
    contentType: 'application/json',
    data: JSON.stringify({
      "content": content
    }),
    success: function(response){
      $(cmt).text(content)
      alert('Updated')
    }
  })
}
function openEditPost(el){
  $('#post_modal').show();
  var post = $(el).parents('.stream-box')[0]
  var currCaption = $('#'+ $(post).attr('id')).find('.card-text')[0]
  var currLink = $('#'+ $(post).attr('id')).find('iframe')[0]
  $('#postId').val($(post).attr('id'))
  $('#postCaption').val($(currCaption).text())
  $('#postLink').val($(currLink).attr('src'))
}
function updatePost(){
  var id = $('#postId').val()
  var postCaption = $('#'+id).find('.card-text')[0]
  var postLink = $('#'+id).find('iframe')[0]
  var caption = $('#postCaption').val()
  var video = $('#postLink').val()
  $.ajax({
    url: "/api/v1/post/"+id,
    type: "PUT",
    contentType: 'application/json',
    data: JSON.stringify({
      "caption": caption,
      "videoLinks": [video]
    }),
    success: function(response){
      console.log(response)
      $(postCaption).text(caption)
      $(postLink).attr('src', video.replace('watch?v=', 'embed/'))
      alert('Updated')
    }
  })
}
function deleteCmt(el){
  var cmt = $(el).parents('.list-comment')[0]
  $.ajax({
    url: "/api/v1/comment/"+$(cmt).attr('id'),
    type: "DELETE",
    success: function(response){
      $(cmt).remove();
      alert('Deleted!')
    }
  })
}
function deletePost(el){
  var post = $(el).parents('.stream-box')[0]
  $.ajax({
    url: "/api/v1/post/"+$(post).attr('id'),
    type: "DELETE",
    success: function(response){
      $(post).remove();
      alert('Deleted!')
    }
  })
}

function loadRoles(){
  $.ajax({
    url: "/api/v1/departments/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      let contentHtml = ''
      var departmentData = response
      
      for (var i = 0; i < departmentData.length; i++) {
        contentHtml += 
        `
        <option value=${departmentData[i].id}>
        ${departmentData[i].name}
        </option>
        `
      }
      document.getElementById("floatingSelect").innerHTML += contentHtml;
    }
  });
}

function getCounts() {
  $.ajax({
    url: "/api/v1/posts/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      count_posts = response.length
      document.getElementById("count_posts").innerHTML = count_posts;
    }
  });
  $.ajax({
    url: "/api/v1/comments/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      count_cmts = response.length
      document.getElementById("count_cmts").innerHTML = count_cmts;
    }
  });
  $.ajax({
    url: "/api/v1/students/",
    type: "GET",
    contentType: 'application/json',
    success: function(response){
      count_stds = response.length
      document.getElementById("count_stds").innerHTML = count_stds;
      
    }
  });
}

$(document).ready(()=> {
  var isHomePage = $('#home_page'),
      isPersonal = $('#personal_page'),
      isNotiPage = $('#noti_page')
      isNotiFormPage = $("#noti_form_page")
      isDashboardPage = $("#dashboard_page")
  var isLoadNoti = false,
      isLoadTopic = false,
      isLoadDep = false
  var accountId = $('#account_id').val();
  if(isHomePage.length > 0){
    getPostsInRange();
    getAllDemoNotis();
    getAllDemoTopics();
    getPostsInRange();
    getCounts();
  } else if (isPersonal.length > 0) {
    getPostsByAccInRange(accountId);
  } else if (isNotiPage.length > 0) {
    if(isLoadNoti == false)
      getNotificationsInRange()
    isLoadNoti = true
  } else if (isNotiFormPage.length > 0) {
    loadTopicOptions()
    getAllDemoNotis()
    getAllDemoNotisPerDep()
  } else if (isDashboardPage.length > 0) {
    loadRoles()
  }
  // $(window).on('scroll', function() {
  //   if ($(window).scrollTop() >= $('#posts_data').offset().top + $('#posts_data').outerHeight() - window.innerHeight) {
  //     if(isHomePage.length > 0){
  //       getPostsInRange();
  //     }
  //     else if (isPersonal.length > 0) {
  //       getPostsByAccInRange(accountId);
  //     } 
  //   }
  // });
  $('#cmt_accept').click(()=>{
    updateComment()
  })
  $('#post_accept').click(()=>{
    updatePost()
  })
  $('#topics-tab').click(()=>{
    if(isLoadTopic == false)
      getTopics()
    isLoadTopic = true
  })
  $('#departments-tab').click(()=>{
    if(isLoadDep == false)
      getDepartments()
    isLoadDep = true
  })
  $('#upload_post-tab').click(()=>{
    var caption = $('#post_content_editor-textarea').text()
    var video = $('#ytb_link').val().replace('watch?v=', 'embed/')
    if (video == "")
      video = []
    var image = []
    addNewPost(accountId, caption, video, image);
  })
  $("#noti-form_add").submit(function (event) {
    event.preventDefault();
    $.ajax({
        url: "/api/v1/notification",
        type: "POST",
        data: JSON.stringify({
          'title': $('#assignment').val(),
          'publishDate': $('#public-time').val(),
          'topicTitle': $('#category').val(),
          'departmentCode': $('#department_code').val(),
          'accountId': accountId,
          'content': $('#post_content_editor-textarea').text()
        }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            sendMessage(data.department.name)
            getAllDemoNotis()
            getAllDemoNotisPerDep()
            console.log(data)
        },
        error: function () {
            alert("error in ajax form submission");
        }
     });
  });

  $("#close_cmt_modal").on('click', ()=>{
    $('#cmt_modal').hide();
  })
  $("#close_post_modal").on('click', ()=>{
    $('#post_modal').hide();
  })
  //search noti
  $('#search-input').focus(function(){
    if (this.value == this.defaultValue) 
      this.value = '';
  })
  $('#search-input').blur(function(){
    if(this.value=='')
      this.value=this.defaultValue;
  })
  // file upload detail
  $('#files-detail').hide();
  $('#show_file_detail-btn').click(function(){
    $('#files-detail').toggle();
    if($('#files-detail').css('display') == 'none')
      $("#show_file_detail-btn").text('Show details');
    else
      $("#show_file_detail-btn").text('Hide details');
    $("#files-detail").text('');
    FileDetails();
  })
  // comment on post
  $(".list-comment").hide();
  $(".bi.bi-caret-down-fill").click(function () {
    console.log('down')
    $(".list-comment").toggle();
    $(".bi.bi-caret-down-fill").toggle();
    $(".bi.bi-caret-up-fill").toggle();
  });
  $(".bi.bi-caret-up-fill").click(function () {
    $(".list-comment").toggle();
    $(".bi.bi-caret-down-fill").toggle();
    $(".bi.bi-caret-up-fill").toggle();
  });

  $(".infocenter_mobile_click").on("click", function () {
    $(".navigation_mobile ul").toggle();
  });
  
  $(".tooltip-btn").click(function () {
    $(".hidden").toggle();
  });
  $(".close-icon").click(function () {
    $(".hidden").toggle();
  });
  $(".class-alter-icon").click(function () {
    $(".class-alter-icon ul").toggle();
  });
  // $(".post-alter-icon").click(function () {
  //   $(".post-alter-icon ul").toggle();
  // });
  $(".add_upload_button_js, #upload_image-btn").click(function () {
    $("li.poll_li_1").css("display", "list-item");
    $(".post_detail_extra").css("display", "block")
  });
  
  $(".question_poll_item").on("click", ".del-poll-li", () => {
    $("li.poll_li_1").css("display", "none");
    $("#show_file_detail-btn").css("display", "none");
    $("#show_file_detail-btn").text('Hide details');
    $("#files-detail").text("");
    $(".file").val("");
    var fi = document.getElementsByClassName("file")[0];
    $(".fakefile button").text("Total files: " + fi.files.length);
  });
  $("textarea.comment-input").keypress(function (e) {
    var char = e.keyCode || e.which;
    if (char == 13) {
      $(this).attr("rows", $(this).rows + 1);
      console.log($(this).rows);
    }
  });
  // tooltip
  $('[data-toggle="tooltip"]').tooltip();


  $("body").on("change", "input[type=file]", function () {
    var fi = document.getElementsByClassName("file")[0];
    $(".fakefile button").text("Total files: " + fi.files.length);
    $('#show_file_detail-btn').click();
    $(".show-files-detail").css("display", "block");
  });
  $("#selectAllAss").click(function () {
    $(".assignment-visibility input[type=checkbox]").prop(
      "checked",
      $(this).prop("checked")
    );
  });
  $("#selectAllMat").click(function () {
    $(".material-visibility input[type=checkbox]").prop(
      "checked",
      $(this).prop("checked")
    );
  });
  $("#selectAllAnn").click(function () {
    $(".announ-visibility input[type=checkbox]").prop(
      "checked",
      $(this).prop("checked")
    );
  });
  $("button").click(function () {
    var array = [];
    $("input:checkbox[name=type]:checked").each(function () {
      array.push($(this).val());
    });
    $("#GFG_DOWN").text(array);
  });
  $(".add_category_btn").click(function () {
    var accountId = $('#account_id').val();
    if ($("#add-new-category").val() != "") {
      $option = $("<option></option>");
      $.ajax({
        url: "/api/v1/topic",
        type: "POST",
        data: JSON.stringify({
          'accountId': accountId,
          'name': $("#add-new-category").val()
        }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          $option.val(data.id);
          $option.text(data.name);
          $("#category").append($option);
        },
        error: function () {
            alert("fail add topic");
        }
      });

    }
  });
  // Emoji selector 
  tinymce.init({
    selector: "#messageInput",
    plugins: "autoresize link lists emoticons",
    toolbar:
        "bold italic underline strikethrough | forecolor | numlist bullist | link blockquote emoticons",
    menubar: false,
    statusbar: false,
    width: "100%",
    toolbar_location: "bottom",
    autoresize_bottom_margin: 0,
    contextmenu: false,
    setup: (ed) => {
        editor = ed;
    },
  });

  // toolbar
  $('.toolbar-btn').click(function(){
    $(this).toggleClass('focused');
  })
  // editor 
  $('#post_editor-expand').hide();

  $('#post_content_editor-textarea').focus(function(){
    $('#editor_title-textarea').addClass('focused');
    $('.content_editor_focus-line').addClass('focused');
  
  })
  $('#post_content_editor-textarea').blur(function(){
    var textboxContent = $.trim($('#post_content_editor-textarea').text());
    if(textboxContent == '')
      $('#editor_title-textarea').removeClass('focused');
      $('.content_editor_focus-line').removeClass('focused');

  })
  $('body').on('DOMSubtreeModified', '#post_content_editor-textarea', function(){
    // console.log('changed');
    var textboxContent = $.trim($('#post_content_editor-textarea').text());
    if(textboxContent != '')
      $('#upload_post-tab').removeClass('empty');
    else
      $('#upload_post-tab').addClass('empty');
  })
  $('#cancel_post-tab').click(function(){
    $('#post_editor-expand').hide();
    $('#post_editor-btn').show();
    $('#post_content_editor-textarea').innerText = '';
  })
  $('#post_editor-btn').click(function(){
    $('#post_editor-expand').show();
    $('#post_editor-btn').hide();
    $('#post_content_editor-textarea').focus();
  })

  // noti stream
  // noti header
  $('.noti-item:not(.active)').click(function(){
    $('.noti-item.active').removeClass('active');
    $(this).addClass('active');
    console.log($(this))
  });
  $('.noti-item.active').click(function(){
    $(this).removeClass('active');
    console.log('have')
  });
  $(document).mouseup(function(e) 
  {
      var container = $('.noti-list');

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
          $('.noti-item').removeClass('active');
          $('.noti-content').removeClass('show');
      }
  });
  //image map 
  $("map").imageMapResize();

  $('#accept_limit_people-btn').click(function(){
    $('#staticBackdrop').hide();
  })
  $(window).scroll(function(e){
    var height = $(window).scrollTop();
    if(height > ($('.top-bar').outerHeight(true)+$('#header').outerHeight(true)+$('.banner').outerHeight(true)+$('#myTab').outerHeight(true)))
      $('#myTab').addClass('scroll');
    else
      $('#myTab').removeClass('scroll');

  })
  // open noti detail
  $('.noti_open').click(()=>{
    console.log('show')
    $(this).next('.modal').show()
  })
});

// ==============================================================================================
// ==============================================================================================
// ==============================================================================================
// ==============================================================================================
// ==============================================================================================
// ==============================================================================================

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  // alert('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // alert('Name: ' + profile.getName());
  // alert('Image URL: ' + profile.getImageUrl());
  // alert('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function FileDetails() {
  var fi = document.getElementsByClassName("file")[0];
  if (fi.files.length > 0) {
    $("#files-detail").append(function () {
      var str = "";
      for (var i = 0; i <= fi.files.length - 1; i++) {
        var fname = fi.files.item(i).name; // THE NAME OF THE FILE.
        var fsize = fi.files.item(i).size; // THE SIZE OF THE FILE.
        str += fname + `<br>`;
      }
      return str;
    });
  } else {
    alert("Please select a file.");
  }
}

/*! Image Map Resizer (imageMapResizer.min.js ) - v1.0.10 - 2019-04-10
 *  Desc: Resize HTML imageMap to scaled image.
 *  Copyright: (c) 2019 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

!(function () {
  "use strict";
  function r() {
    function e() {
      var r = {
          width: u.width / u.naturalWidth,
          height: u.height / u.naturalHeight,
        },
        a = {
          width: parseInt(
            window.getComputedStyle(u, null).getPropertyValue("padding-left"),
            10
          ),
          height: parseInt(
            window.getComputedStyle(u, null).getPropertyValue("padding-top"),
            10
          ),
        };
      i.forEach(function (e, t) {
        var n = 0;
        o[t].coords = e
          .split(",")
          .map(function (e) {
            var t = 1 == (n = 1 - n) ? "width" : "height";
            return a[t] + Math.floor(Number(e) * r[t]);
          })
          .join(",");
      });
    }
    function t(e) {
      return e.coords.replace(/ *, */g, ",").replace(/ +/g, ",");
    }
    function n() {
      clearTimeout(d), (d = setTimeout(e, 250));
    }
    function r(e) {
      return document.querySelector('img[usemap="' + e + '"]');
    }
    var a = this,
      o = null,
      i = null,
      u = null,
      d = null;
    "function" != typeof a._resize
      ? ((o = a.getElementsByTagName("area")),
        (i = Array.prototype.map.call(o, t)),
        (u = r("#" + a.name) || r(a.name)),
        (a._resize = e),
        u.addEventListener("load", e, !1),
        window.addEventListener("focus", e, !1),
        window.addEventListener("resize", n, !1),
        window.addEventListener("readystatechange", e, !1),
        document.addEventListener("fullscreenchange", e, !1),
        (u.width === u.naturalWidth && u.height === u.naturalHeight) || e())
      : a._resize();
  }
  function e() {
    function t(e) {
      e &&
        (!(function (e) {
          if (!e.tagName)
            throw new TypeError("Object is not a valid DOM element");
          if ("MAP" !== e.tagName.toUpperCase())
            throw new TypeError(
              "Expected <MAP> tag, found <" + e.tagName + ">."
            );
        })(e),
        r.call(e),
        n.push(e));
    }
    var n;
    return function (e) {
      switch (((n = []), typeof e)) {
        case "undefined":
        case "string":
          Array.prototype.forEach.call(
            document.querySelectorAll(e || "map"),
            t
          );
          break;
        case "object":
          t(e);
          break;
        default:
          throw new TypeError("Unexpected data type (" + typeof e + ").");
      }
      return n;
    };
  }
  "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = e())
    : (window.imageMapResize = e()),
    "jQuery" in window &&
      (window.jQuery.fn.imageMapResize = function () {
        return this.filter("map").each(r).end();
      });
})();



//==================================== ZABUTO CALENDAR ===========================================
if (typeof jQuery == "undefined") {
  throw new Error("jQuery is not loaded");
}
$.fn.zabuto_calendar = function (b) {
  var c = $.extend({}, $.fn.zabuto_calendar_defaults(), b);
  var a = $.fn.zabuto_calendar_language(c.language);
  c = $.extend({}, c, a);
  this.each(function () {
    var i = $(this);
    i.attr(
      "id",
      "zabuto_calendar_" + Math.floor(Math.random() * 99999).toString(36)
    );
    i.data("initYear", c.year);
    i.data("initMonth", c.month);
    i.data("monthLabels", c.month_labels);
    i.data("weekStartsOn", c.weekstartson);
    i.data("navIcons", c.nav_icon);
    i.data("dowLabels", c.dow_labels);
    i.data("showToday", c.today);
    i.data("showDays", c.show_days);
    i.data("showPrevious", c.show_previous);
    i.data("showNext", c.show_next);
    i.data("cellBorder", c.cell_border);
    i.data("jsonData", c.data);
    i.data("ajaxSettings", c.ajax);
    i.data("legendList", c.legend);
    i.data("actionFunction", c.action);
    i.data("actionNavFunction", c.action_nav);
    k();
    function k() {
      var x = parseInt(i.data("initYear"));
      var A = parseInt(i.data("initMonth")) - 1;
      var C = new Date(x, A, 1, 0, 0, 0, 0);
      i.data("initDate", C);
      var D = i.data("cellBorder") === true ? " table-bordered" : "";
      var B = $('<table class="table' + D + '"></table>');
      B = u(i, B, C.getFullYear(), C.getMonth());
      var w = f(i);
      var y = $('<div class="zabuto_calendar"></div>');
      y.append(B);
      y.append(w);
      i.append(y);
      var z = i.data("jsonData");
      if (false !== z) {
        p(i, C.getFullYear(), C.getMonth());
      }
    }
    function u(y, A, x, z) {
      var w = new Date(x, z, 1, 0, 0, 0, 0);
      y.data("currDate", w);
      A.empty();
      A = q(y, A, x, z);
      A = d(y, A);
      A = o(y, A, x, z);
      p(y, x, z);
      return A;
    }
    function f(y) {
      var w = $('<div class="legend" id="' + y.attr("id") + '_legend"></div>');
      var x = y.data("legendList");
      if (typeof x == "object" && x.length > 0) {
        $(x).each(function (C, E) {
          if (typeof E == "object") {
            if ("type" in E) {
              var D = "";
              if ("label" in E) {
                D = E.label;
              }
              switch (E.type) {
                case "text":
                  if (D !== "") {
                    var B = "";
                    if ("badge" in E) {
                      if (typeof E.classname === "undefined") {
                        var F = "badge-event";
                      } else {
                        var F = E.classname;
                      }
                      B =
                        '<span class="badge ' + F + '">' + E.badge + "</span> ";
                    }
                    w.append(
                      '<span class="legend-' + E.type + '">' + B + D + "</span>"
                    );
                  }
                  break;
                case "block":
                  if (D !== "") {
                    D = "<span>" + D + "</span>";
                  }
                  if (typeof E.classname === "undefined") {
                    var A = "event";
                  } else {
                    var A = "event-styled " + E.classname;
                  }
                  w.append(
                    '<span class="legend-' +
                      E.type +
                      '"><ul class="legend"><li class="' +
                      A +
                      '"></li></ul>' +
                      D +
                      "</span>"
                  );
                  break;
                case "list":
                  if (
                    "list" in E &&
                    typeof E.list == "object" &&
                    E.list.length > 0
                  ) {
                    var z = $('<ul class="legend"></ul>');
                    $(E.list).each(function (H, G) {
                      z.append('<li class="' + G + '"></li>');
                    });
                    w.append(z);
                  }
                  break;
                case "spacer":
                  w.append('<span class="legend-' + E.type + '"> </span>');
                  break;
              }
            }
          }
        });
      }
      return w;
    }
    function q(E, D, G, M) {
      var L = E.data("navIcons");
      var A = $(
        `<span><span class="glyphicon glyphicon-chevron-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
        </span></span>`
      );
      var Q = $(
        `<span><span class="glyphicon glyphicon-chevron-right">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        </span></span>`
      );
      if (typeof L === "object") {
        if ("prev" in L) {
          A.html(L.prev);
        }
        if ("next" in L) {
          Q.html(L.next);
        }
      }
      var K = E.data("showPrevious");
      if (typeof K === "number" || K === false) {
        K = n(E.data("showPrevious"), true);
      }
      var w = $('<div class="calendar-month-navigation"></div>');
      w.attr("id", E.attr("id") + "_nav-prev");
      w.data("navigation", "prev");
      if (K !== false) {
        var N = M - 1;
        var F = G;
        if (N == -1) {
          F = F - 1;
          N = 11;
        }
        w.data("to", { year: F, month: N + 1 });
        w.append(A);
        if (typeof E.data("actionNavFunction") === "function") {
          w.click(E.data("actionNavFunction"));
        }
        w.click(function (R) {
          u(E, D, F, N);
        });
      }
      var C = E.data("showNext");
      if (typeof C === "number" || C === false) {
        C = n(E.data("showNext"), false);
      }
      var z = $('<div class="calendar-month-navigation"></div>');
      z.attr("id", E.attr("id") + "_nav-next");
      z.data("navigation", "next");
      if (C !== false) {
        var x = M + 1;
        var P = G;
        if (x == 12) {
          P = P + 1;
          x = 0;
        }
        z.data("to", { year: P, month: x + 1 });
        z.append(Q);
        if (typeof E.data("actionNavFunction") === "function") {
          z.click(E.data("actionNavFunction"));
        }
        z.click(function (R) {
          u(E, D, P, x);
        });
      }
      var B = E.data("monthLabels");
      var J = $("<td></td>").append(w);
      var O = $("<td></td>").append(z);
      var H = $("<span>" + B[M] + " " + G + "</span>");
      H.dblclick(function () {
        var R = E.data("initDate");
        u(E, D, R.getFullYear(), R.getMonth());
      });
      var I = $('<td colspan="5"></td>');
      I.append(H);
      var y = $('<tr class="calendar-month-header"></tr>');
      y.append(J, I, O);
      D.append(y);
      return D;
    }
    function d(z, B) {
      if (z.data("showDays") === true) {
        var w = z.data("weekStartsOn");
        var x = z.data("dowLabels");
        if (w === 0) {
          var A = $.extend([], x);
          var C = new Array(A.pop());
          x = C.concat(A);
        }
        var y = $('<tr class="calendar-dow-header"></tr>');
        $(x).each(function (D, E) {
          y.append("<th>" + E + "</th>");
        });
        B.append(y);
      }
      return B;
    }
    function o(E, D, G, L) {
      var C = E.data("ajaxSettings");
      var F = r(G, L);
      var w = m(G, L);
      var B = h(G, L, 1);
      var N = h(G, L, w);
      var A = 1;
      var z = E.data("weekStartsOn");
      if (z === 0) {
        if (N == 6) {
          F++;
        }
        if (B == 6 && (N == 0 || N == 1 || N == 5)) {
          F--;
        }
        B++;
        if (B == 7) {
          B = 0;
        }
      }
      for (var y = 0; y < F; y++) {
        var x = $('<tr class="calendar-dow"></tr>');
        for (var I = 0; I < 7; I++) {
          if (I < B || A > w) {
            x.append("<td></td>");
          } else {
            var M = E.attr("id") + "_" + j(G, L, A);
            var K = M + "_day";
            var J = $('<div id="' + K + '" class="day" >' + A + "</div>");
            J.data("day", A);
            if (v(G, L, A)) {
              J.addClass("today");
              if (E.data("showToday") === true) {
                J.html('<span class="badge badge-today">' + A + "</span>");
              }
            }
            var H = $('<td id="' + M + '"></td>');
            H.append(J);
            H.data("date", j(G, L, A));
            H.data("hasEvent", false);
            if (typeof E.data("actionFunction") === "function") {
              H.addClass("dow-clickable");
              H.click(function () {
                E.data("selectedDate", $(this).data("date"));
              });
              H.click(E.data("actionFunction"));
            }
            x.append(H);
            A++;
          }
          if (I == 6) {
            B = 0;
          }
        }
        D.append(x);
      }
      return D;
    }
    function g(z, F, E, H) {
      var G = $(
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
      );
      var y = $(
        '<h4 class="modal-title" id="' + z + '_modal_title">' + F + "</h4>"
      );
      var I = $('<div class="modal-header"></div>');
      I.append(G);
      I.append(y);
      var D = $(
        '<div class="modal-body" id="' + z + '_modal_body">' + E + "</div>"
      );
      var C = $('<div class="modal-footer" id="' + z + '_modal_footer"></div>');
      if (typeof H !== "undefined") {
        var x = $("<div>" + H + "</div>");
        C.append(x);
      }
      var A = $('<div class="modal-content"></div>');
      A.append(I);
      A.append(D);
      A.append(C);
      var w = $('<div class="modal-dialog"></div>');
      w.append(A);
      var B = $(
        '<div class="modal fade" id="' +
          z +
          '_modal" tabindex="-1" role="dialog" aria-labelledby="' +
          z +
          '_modal_title" aria-hidden="true"></div>'
      );
      B.append(w);
      B.data("dateId", z);
      B.attr("dateId", z);
      return B;
    }
    function p(y, x, A) {
      var w = y.data("jsonData");
      var z = y.data("ajaxSettings");
      y.data("events", false);
      if (false !== w) {
        return l(y);
      } else {
        if (false !== z) {
          return s(y, x, A);
        }
      }
      return true;
    }
    function l(x) {
      var w = x.data("jsonData");
      x.data("events", w);
      e(x, "json");
      return true;
    }
    function s(x, w, A) {
      var z = x.data("ajaxSettings");
      if (typeof z != "object" || typeof z.url == "undefined") {
        alert("Invalid calendar event settings");
        return false;
      }
      var y = { year: w, month: A + 1 };
      $.ajax({ type: "GET", url: z.url, data: y, dataType: "json" }).done(
        function (B) {
          var C = [];
          $.each(B, function (E, D) {
            C.push(B[E]);
          });
          x.data("events", C);
          e(x, "ajax");
        }
      );
      return true;
    }
    function e(z, y) {
      var x = z.data("jsonData");
      var A = z.data("ajaxSettings");
      var w = z.data("events");
      if (w !== false) {
        $(w).each(function (F, H) {
          var B = z.attr("id") + "_" + H.date;
          var D = $("#" + B);
          var I = $("#" + B + "_day");
          D.data("hasEvent", true);
          if (typeof H.title !== "undefined") {
            D.attr("title", H.title);
          }
          if (typeof H.classname === "undefined") {
            D.addClass("event");
          } else {
            D.addClass("event-styled");
            I.addClass(H.classname);
          }
          if (typeof H.badge !== "undefined" && H.badge !== false) {
            var C = H.badge === true ? "" : " badge-" + H.badge;
            var E = I.data("day");
            I.html('<span class="badge badge-event' + C + '">' + E + "</span>");
          }
          if (typeof H.body !== "undefined") {
            var G = false;
            if (
              y === "json" &&
              typeof H.modal !== "undefined" &&
              H.modal === true
            ) {
              G = true;
            } else {
              if (y === "ajax" && "modal" in A && A.modal === true) {
                G = true;
              }
            }
            if (G === true) {
              D.addClass("event-clickable");
              var J = g(B, H.title, H.body, H.footer);
              $("body").append(J);
              $("#" + B).click(function () {
                $("#" + B + "_modal").modal();
              });
            }
          }
        });
      }
    }
    function v(y, z, x) {
      var A = new Date();
      var w = new Date(y, z, x);
      return w.toDateString() == A.toDateString();
    }
    function j(y, z, x) {
      var w, A;
      A = x < 10 ? "0" + x : x;
      w = z + 1;
      w = w < 10 ? "0" + w : w;
      return y + "-" + w + "-" + A;
    }
    function h(y, z, x) {
      var w = new Date(y, z, x, 0, 0, 0, 0);
      var A = w.getDay();
      if (A == 0) {
        A = 6;
      } else {
        A--;
      }
      return A;
    }
    function m(x, y) {
      var w = 28;
      while (t(x, y + 1, w + 1)) {
        w++;
      }
      return w;
    }
    function r(y, A) {
      var w = m(y, A);
      var C = h(y, A, 1);
      var z = h(y, A, w);
      var B = w;
      var x = C - z;
      if (x > 0) {
        B += x;
      }
      return Math.ceil(B / 7);
    }
    function t(z, w, x) {
      return (
        w > 0 &&
        w < 13 &&
        z > 0 &&
        z < 32768 &&
        x > 0 &&
        x <= new Date(z, w, 0).getDate()
      );
    }
    function n(y, A) {
      if (y === false) {
        y = 0;
      }
      var z = i.data("currDate");
      var x = i.data("initDate");
      var w;
      w = (x.getFullYear() - z.getFullYear()) * 12;
      w -= z.getMonth() + 1;
      w += x.getMonth();
      if (A === true) {
        if (w < parseInt(y) - 1) {
          return true;
        }
      } else {
        if (w >= 0 - parseInt(y)) {
          return true;
        }
      }
      return false;
    }
  });
  return this;
};
$.fn.zabuto_calendar_defaults = function () {
  var a = new Date();
  var c = a.getFullYear();
  var d = a.getMonth() + 1;
  var b = {
    language: false,
    year: c,
    month: d,
    show_previous: true,
    show_next: true,
    cell_border: false,
    today: true,
    show_days: true,
    weekstartson: 1,
    nav_icon: false,
    data: false,
    ajax: false,
    legend: false,
    action: false,
    action_nav: false,
  };
  return b;
};
$.fn.zabuto_calendar_language = function (a) {
  if (typeof a == "undefined" || a === false) {
    a = "en";
  }
  switch (a.toLowerCase()) {
    case "ar":
      return {
        month_labels: [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ],
        dow_labels: ["أثنين", "ثلاثاء", "اربعاء", "خميس", "جمعه", "سبت", "أحد"],
      };
      break;
    case "az":
      return {
        month_labels: [
          "Yanvar",
          "Fevral",
          "Mart",
          "Aprel",
          "May",
          "İyun",
          "İyul",
          "Avqust",
          "Sentyabr",
          "Oktyabr",
          "Noyabr",
          "Dekabr",
        ],
        dow_labels: ["B.e", "Ç.A", "Çərş", "C.A", "Cümə", "Şən", "Baz"],
      };
      break;
    case "ca":
      return {
        month_labels: [
          "Gener",
          "Febrer",
          "Març",
          "Abril",
          "Maig",
          "Juny",
          "Juliol",
          "Agost",
          "Setembre",
          "Octubre",
          "Novembre",
          "Desembre",
        ],
        dow_labels: ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"],
      };
      break;
    case "cn":
      return {
        month_labels: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ],
        dow_labels: [
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
          "星期日",
        ],
      };
      break;
    case "cs":
      return {
        month_labels: [
          "Leden",
          "Únor",
          "Březen",
          "Duben",
          "Květen",
          "Červen",
          "Červenec",
          "Srpen",
          "Září",
          "Říjen",
          "Listopad",
          "Prosinec",
        ],
        dow_labels: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
      };
      break;
    case "de":
      return {
        month_labels: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember",
        ],
        dow_labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      };
      break;
    case "en":
      return {
        month_labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        dow_labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      };
      break;
    case "he":
      return {
        month_labels: [
          "ינואר",
          "פברואר",
          "מרץ",
          "אפריל",
          "מאי",
          "יוני",
          "יולי",
          "אוגוסט",
          "ספטמבר",
          "אוקטובר",
          "נובמבר",
          "דצמבר",
        ],
        dow_labels: ["ב", "ג", "ד", "ה", "ו", "ש", "א"],
      };
      break;
    case "es":
      return {
        month_labels: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        dow_labels: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
      };
      break;
    case "fi":
      return {
        month_labels: [
          "Tammikuu",
          "Helmikuu",
          "Maaliskuu",
          "Huhtikuu",
          "Toukokuu",
          "Kesäkuu",
          "Heinäkuu",
          "Elokuu",
          "Syyskuu",
          "Lokakuu",
          "Marraskuu",
          "Joulukuu",
        ],
        dow_labels: ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
      };
      break;
    case "fr":
      return {
        month_labels: [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ],
        dow_labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      };
      break;
    case "hu":
      return {
        month_labels: [
          "Január",
          "Február",
          "Március",
          "Április",
          "Május",
          "Június",
          "Július",
          "Augusztus",
          "Szeptember",
          "Október",
          "November",
          "December",
        ],
        dow_labels: ["Hé", "Ke", "Sze", "Cs", "Pé", "Szo", "Va"],
      };
      break;
    case "id":
      return {
        month_labels: [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ],
        dow_labels: [
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jum'at",
          "Sabtu",
          "Minggu",
        ],
      };
      break;
    case "it":
      return {
        month_labels: [
          "Gennaio",
          "Febbraio",
          "Marzo",
          "Aprile",
          "Maggio",
          "Giugno",
          "Luglio",
          "Agosto",
          "Settembre",
          "Ottobre",
          "Novembre",
          "Dicembre",
        ],
        dow_labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
      };
      break;
    case "jp":
      return {
        month_labels: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        dow_labels: ["月", "火", "水", "木", "金", "土", "日"],
      };
      break;
    case "kr":
      return {
        month_labels: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
        dow_labels: ["월", "화", "수", "목", "금", "토", "일"],
      };
      break;
    case "nl":
      return {
        month_labels: [
          "Januari",
          "Februari",
          "Maart",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Augustus",
          "September",
          "Oktober",
          "November",
          "December",
        ],
        dow_labels: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
      };
      break;
    case "no":
      return {
        month_labels: [
          "Januar",
          "Februar",
          "Mars",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Desember",
        ],
        dow_labels: ["Ma", "Ti", "On", "To", "Fr", "L\u00f8", "S\u00f8"],
      };
      break;
    case "pl":
      return {
        month_labels: [
          "Styczeń",
          "Luty",
          "Marzec",
          "Kwiecień",
          "Maj",
          "Czerwiec",
          "Lipiec",
          "Sierpień",
          "Wrzesień",
          "Październik",
          "Listopad",
          "Grudzień",
        ],
        dow_labels: ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."],
      };
      break;
    case "pt":
      return {
        month_labels: [
          "Janeiro",
          "Fevereiro",
          "Marco",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ],
        dow_labels: ["S", "T", "Q", "Q", "S", "S", "D"],
      };
      break;
    case "ru":
      return {
        month_labels: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
        dow_labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вск"],
      };
      break;
    case "se":
      return {
        month_labels: [
          "Januari",
          "Februari",
          "Mars",
          "April",
          "Maj",
          "Juni",
          "Juli",
          "Augusti",
          "September",
          "Oktober",
          "November",
          "December",
        ],
        dow_labels: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"],
      };
      break;
    case "sk":
      return {
        month_labels: [
          "Január",
          "Február",
          "Marec",
          "Apríl",
          "Máj",
          "Jún",
          "Júl",
          "August",
          "September",
          "Október",
          "November",
          "December",
        ],
        dow_labels: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
      };
      break;
    case "sr":
      return {
        month_labels: [
          "Јануар",
          "Фебруар",
          "Март",
          "Април",
          "Мај",
          "Јун",
          "Јул",
          "Август",
          "Септембар",
          "Октобар",
          "Новембар",
          "Децембар",
        ],
        dow_labels: ["Пон", "Уто", "Сре", "Чет", "Пет", "Суб", "Нед"],
      };
      break;
    case "tr":
      return {
        month_labels: [
          "Ocak",
          "Şubat",
          "Mart",
          "Nisan",
          "Mayıs",
          "Haziran",
          "Temmuz",
          "Ağustos",
          "Eylül",
          "Ekim",
          "Kasım",
          "Aralık",
        ],
        dow_labels: ["Pts", "Salı", "Çar", "Per", "Cuma", "Cts", "Paz"],
      };
      break;
    case "ua":
      return {
        month_labels: [
          "Січень",
          "Лютий",
          "Березень",
          "Квітень",
          "Травень",
          "Червень",
          "Липень",
          "Серпень",
          "Вересень",
          "Жовтень",
          "Листопад",
          "Грудень",
        ],
        dow_labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
      };
      break;
  }
};
$(document).ready(function () {
  $("#demo").zabuto_calendar();
});



