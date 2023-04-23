const colorPickerBtn = document.getElementById('color-picker');
const colorListEl = document.querySelector('.all-colors');
const clearAllEl = document.querySelector('.clear-all');

const pickedColors = JSON.parse(localStorage.getItem('picked-colors') || '[]');

const copyColor = (elem) => {
    navigator.clipboard.writeText(elem.dataset.color);
    elem.innerHTML = "copied";
    setTimeout(()=> elem.innerHTML = elem.dataset.color, 1000);
}

function showColors()
{
    if(!pickedColors.length) return;
    colorListEl.innerHTML= pickedColors.map(color => `
    <li class="color">
        <span class="rect" style="background:${color}; border:1px solid ${color == '#ffffff' ? '#ccc' : "#fff"}"></span>
        <span class="value" data-color="${color}">${color}</span>
    </li>`).join("");

    document.querySelector('.picked-colors').classList.remove('hide');

    //adding a click event listener to each color element to copy the color code
    document.querySelectorAll('.color').forEach(li => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild));
    })
}

showColors()

const activateEyeDropper = ()=>{
    document.body.style.display = "none";
    setTimeout(async () =>{
        try
        {
            //opening the eye dropper and getting the selected color
            const eyeDropper = new EyeDropper();
            const {sRGBHex} = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);  
    
            //includes only new colors
            if(!pickedColors.includes(sRGBHex))
            {
                pickedColors.push(sRGBHex);
                localStorage.setItem('picked-colors', JSON.stringify(pickedColors));
                showColors();
            }
        }
        catch(error)
        {
            console.log(error);
        } 
        document.body.style.display = "block";
    },10);

}

function clearAllColors()
{
    localStorage.clear('picked-colors');
    document.querySelector('.picked-colors').classList.add('hide');
}

clearAllEl.addEventListener('click', clearAllColors);
colorPickerBtn.addEventListener('click', activateEyeDropper);

