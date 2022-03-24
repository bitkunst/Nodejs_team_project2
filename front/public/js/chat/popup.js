
function openWindowPop(url, name){
    const popupWidth = 600
    const popupHeight = 700
    const popupX = (window.screen.width/2) - (popupWidth/2)
    const popupY = (window.screen.height/2) - (popupHeight/2)
    const options = `top=${popupY}, left=${popupX} width=${popupWidth}, height=${popupHeight}, status=no, menubar=no, toolbar=no, resizable=no, location=no, scrollbars=no`
    window.open(url, name, options)
}


