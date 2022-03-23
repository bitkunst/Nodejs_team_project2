
function openWindowPop(url, name){
    const popupWidth = 500
    const popupHeight = 600
    const popupX = (window.screen.width/2) - (popupWidth/2)
    const popupY = (window.screen.height/2) - (popupHeight/2)
    var options = `top=${popupY}, left=${popupX} width=${popupWidth}, height=${popupHeight}, status=no, menubar=no, toolbar=no, resizable=no`
    window.open(url, name, options)
}


