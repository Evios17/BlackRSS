function onglet(input1, input2) {
    const btns = document.querySelectorAll(input1);
    const ctns = document.querySelectorAll(input2);

    try{
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.tab;
                console.log("Click ! Onglet : " + index);

                if (btn.classList.contains('active')) return;

                btns.forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');

                ctns.forEach(ctn => {
                    if (ctn.dataset.tab === index) {
                        ctn.classList.add('active');
                    } else {
                        ctn.classList.remove('active');
                    }
                });
            });
        });
    } catch (e) {
        document.querySelector('.console-log').innerHTML += e;
    }
}

onglet(".tab-btn", ".tab-pane");

function display(input1, input2) {
    const button = document.querySelector(input1);
    const display = document.querySelector(input2);

    try{
        button.addEventListener('click', () => {
            console.log("Click !");

            button.classList.toggle('toggle');
            display.classList.toggle('toggle');
        });
    } catch (e) {
        document.querySelector('.console-log').innerHTML += e;
    }
}

display(".switch-btn",".feed-list")