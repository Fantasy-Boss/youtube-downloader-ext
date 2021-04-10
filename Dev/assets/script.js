$(document).ready(()=> {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        let url = new URL(tab.url)
        if (url.href.includes('youtube.com/watch')) {
            check(url.searchParams.get("v"))
        } else {
            $('.search').addClass('free')
            $('.or').hide()
            $('.content').hide()
            $('.loader').fadeOut(300)
        }
        $('#search').click(()=> input())
    })
})

let title = ''

const check = (id) => {
    if (id) {
        fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`).then((res)=> res.json()).then((res)=> {
            $('.search').removeClass('free')
            $('.or').show()
            $('.content').show()
            $('.content img').attr('src', res.thumbnail_url)
            $('.content .name').text(res.title)
            $('.loader').fadeOut(300)
            title = res.title
        }).catch(()=> error('An error occurred'))
        $('#audio').click(()=> load(`https://www.yt-download.org/api/button/mp3/${id}`))
        $('#video').click(()=> load(`https://www.yt-download.org/api/button/videos/${id}`))
    } else error('An error occurred')
}

const load = (url) => {
    $('.loader').css('background-color', 'rgb(15, 29, 44)')
    $('.loader').fadeIn(100)
    $('.next').load(`${url} .download`, ()=> {
        $('.loader').fadeOut(100)
        $('.next').append('<div class="back">< Go Back</div>')
        $('.back').click(()=> {
            $('.next').hide()
            $('.container').show()
        })
        $('.download').addClass('noselect')
        $('.container').hide()
        $('.next').show()
    })
}


const input = () => {
    let inp = (($('#input').val()).replace('https://', '')).replace('www.', '')
    if ($('#input').val() == '') error('Field is empty')
    else if (inp.includes('youtube.com/watch')) {
        let url = new URL($('#input').val())
        check(url.searchParams.get("v"))
    } else if (inp.includes('youtu.be/')) {
        let res = inp.replace('youtu.be/', '')
        if (res.length != 11) {
            let l = ''
            for (let i = 0; i<11; i++) {
                l += res[i]
            }
            check(l)
        } else check(res)
        
    } else error('This isn\'t a Youtube link')
}

var isTimer = false
var timer
const error = (o) => {
    $('.err').text(o).show(100)
    isTimer? clearTimeout(timer) : null
    isTimer = true
    timer = setTimeout(() => {
        isTimer = false
        $('.err').hide(100)
    }, 5000)
}