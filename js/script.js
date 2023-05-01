'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  bottomTagLink: Handlebars.compile(document.querySelector('#template-bottomTag-link').innerHTML),
  upperAuthorLink: Handlebars.compile(document.querySelector('#template-upperAuthor-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-cloud-link').innerHTML),
  authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML),
};

const optSelectorTo = {
  article: '.post',
  postTitles: '.post-title',
  listOfTitles: '.titles',
  articleTags: '.post-tags .list',
  articleAuthor: '.post .post-author',
  listOfAuthors: '.list.authors',
  listOfTags: '.list.tags',
};

const optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');


  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const aAttribute = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const newActiveArticle = document.querySelector(aAttribute);


  /* [DONE] add class 'active' to the correct article */
  newActiveArticle.classList.add('active');
};

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optSelectorTo.listOfTitles);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optSelectorTo.article + customSelector);

  let html = '';

  for(let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */

    const articleTitle = article.querySelector(optSelectorTo.postTitles).innerHTML;

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    //titleList.innerHTML = titleList.innerHTML + linkHTML;
    //titleList.insertAdjacentHTML("beforeend", linkHTML);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {
    min: 999999,
    max: 0
  };

  for(let i in tags){
    params.max = Math.max(tags[i], params.max);
    params.min = Math.min(tags[i], params.min);
  }

  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const allArticles = document.querySelectorAll(optSelectorTo.article);

  /* START LOOP: for every article: */
  for (let article of allArticles){

    /* find tags wrapper */
    const tagWrapper = article.querySelector(optSelectorTo.articleTags);

    /* make html variable with empty string */
    let tagHTML = '';

    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');

    /* split tags into array */
    const tagsArray = tags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of tagsArray){

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag};
      const linkHTML = templates.bottomTagLink(linkHTMLData);

      /* add generated code to html variable */
      tagHTML = tagHTML + ' ' + linkHTML;


      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      }
      else {
        allTags[tag]++;
      }

      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.innerHTML = tagHTML;
      /* END LOOP: for every article: */
    }
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optSelectorTo.listOfTags);

  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */

    //allTagsHTML += tagLinkHTML;
    //allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + tagLinkHTML + '">' + tag + '</a></li> ';

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-','');

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks){
    /* remove class active */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of allTagLinks){

    /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('.post .list a, .sidebar .tags a');

  /* START LOOP: for each link */
  for(let link of links){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

function generateAuthors(){
  let allAuthors = {};

  /* find all articles */
  const allArticles = document.querySelectorAll(optSelectorTo.article);

  /* START LOOP: for every article: */
  for (let article of allArticles){
    const authorWrapper = article.querySelector(optSelectorTo.articleAuthor);
    const author = article.getAttribute('data-author');
    const authorHTMLData = {id: author};
    const authorHTML = templates.upperAuthorLink(authorHTMLData);
    authorWrapper.innerHTML = authorHTML;

    if(!allAuthors[author]){
      allAuthors[author] = 1;
    }
    else {
      allAuthors[author]++;
    }
  }

  const authorsForTemplate = {author: []};

  for (let i in allAuthors){
    authorsForTemplate.author.push({
      name: i,
      count: allAuthors[i],
    });
  }

  const authorsList = document.querySelector(optSelectorTo.listOfAuthors);
  authorsList.innerHTML = templates.authorsListLink(authorsForTemplate);
}

generateAuthors();

function authorClickHandler(event){

  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#','');
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const links = document.querySelectorAll('.post .post-author a, .list.authors a');
  for(let link of links){
    link.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();
