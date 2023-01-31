var container = document.querySelector('.feed')
var relativeDate = new Intl.RelativeTimeFormat('en', { style: 'narrow', numeric: 'auto'});
const now = Date.now()
var openPost

render_post = (el, postID) => {
    const post = document.createElement('div')
    post.classList.add('post')
    fetch(`posts/${postID}`).then((response) => {
        response.text().then((postText) => {
            post.innerHTML = postText
        })
    })
    post.addEventListener('click', (e) => {
        e.stopPropagation()
    })
    el.closest('.content').appendChild(post)
    entry = el.closest('.entry')
    entry.classList.add('open')
    container.classList.add('reading')
    entry.scrollIntoView({block:'start', behavior: "smooth"})
    openPost = postID
}

linkHandler = (e) => {
    e.stopPropagation()
    var postID  = e.target.closest('.content').dataset.post
    if (openPost == postID) {
        container.classList.remove('reading')
        const reading = document.querySelector('.post')
        if (reading) {
            reading.closest('.entry').classList.remove('open')
            reading.remove()
        }
        e.target.closest('.entry').scrollIntoView({block:'start', behavior: "smooth"})
        openPost = ''
    } else {
        const reading = document.querySelector('.post')
        if (reading) {
            reading.closest('.entry').classList.remove('open')
            reading.remove()
        }
        render_post(e.target, postID)
    }
}

format_entry = (entry) => {

    date = new Date(entry['published_at'])
    days = parseInt((now - date) / 86400000)
    dateShort = relativeDate.format(0 - days, 'day')
    dateLong = date.toLocaleDateString('en-US', {hour:"numeric", minute:"numeric", day: "numeric", month: 'long', hourCycle: 'h23'})

    const link = document.createElement('a')
    link.classList = ['entry']
    // link.href = entry.url
    // link.title = dateString
    
    const content = document.createElement('div')
    content.classList = ['content']
    content.dataset.post = entry.id
    content.addEventListener('click', linkHandler)

    const header = document.createElement('div')
    header.classList = ['header']

    const title = document.createElement('div')
    title.classList = ['title']
    title.textContent = entry.title
    header.appendChild(title)

    const meta = document.createElement('div')
    meta.classList = ['meta']
    
    const pubdate = document.createElement('span')
	pubdate.classList = ['pubdate']
    pubdate.textContent = dateShort
    pubdate.title = dateLong

    const source = document.createElement('span')
    source.classList = ['source']
    source.dataset.post = entry.id
    source.textContent = entry.feed
    
    meta.appendChild(source)
    meta.appendChild(pubdate)
    
    header.appendChild(meta)
    content.appendChild(header)

    const original = document.createElement('a')
    original.classList.add('original')
    original.href = entry.url
    original.target = '_blank'

    link.appendChild(original)
    link.appendChild(content)
    return link
}

render_category = (cat) => {

    const category = document.createElement('div')
    category.classList.add('category')

    const category_header = document.createElement('div')
    category_header.classList.add('category_header')
    category_header.textContent = cat.name
    
    const category_entries = document.createElement('div')
    category_entries.classList.add('category_entries')
    cat.entries.forEach(e => {
        const entry = format_entry(e)
        category_entries.appendChild(entry)
    })

    category.appendChild(category_header)
    category.appendChild(category_entries)
    container.appendChild(category)
}

download_and_render = () => {
    url = "entries.json"    
    fetch(url).then((response) => {
	response.json().then((categories) => {
	    categories.forEach(cat => render_category(cat))
	})
    })
}

download_and_render()
