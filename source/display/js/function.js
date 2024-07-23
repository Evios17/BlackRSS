function onglet(input1, input2) {
    const btns = document.querySelectorAll(input1);
    const ctns = document.querySelectorAll(input2);

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.ogtl;
            console.log("Click ! Onglet : " + index);

            if (btn.classList.contains('active')) return;

            btns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');

            ctns.forEach(ctn => {
                if (ctn.dataset.ogtl === index) {
                    ctn.classList.add('active');
                } else {
                    ctn.classList.remove('active');
                }
            });
        });
    });
}

onglet(".onglet__button", ".onglet__case");

function display(input1, input2) {
    const button = document.querySelector(input1);
    const display = document.querySelector(input2);

    button.addEventListener('click', () => {
        console.log("Click !");

        button.classList.toggle('toggle');
        display.classList.toggle('toggle');
    })
}

display(".case-0__header-navigation-button",".case-0__section")