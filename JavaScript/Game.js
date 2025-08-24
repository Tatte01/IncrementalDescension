// ============== Storage ==============
const GameSave = {
    Resources: {
        Click: {
            "Level" : 1,
            "Cost" : 10
        },
        Coal:  {
            "Level" : 0,
            "Cost" : 10,
            "Unlocked" : true
        },
        Silver: {
            "Level" : 0,
            "Cost" : 5000,
            "Unlocked" : false
        },
        Gold:  {
            "Level" : 0,
            "Cost" : 50000,
            "Unlocked" : false
        },
        Diamond:  {
            "Level" : 0,
            "Cost" : 250000,
            "Unlocked" : false
        },
        Uranium:  {
            "Level" : 0,
            "Cost" : 500000,
            "Unlocked" : false
        }
    },
    Achievements: {
        Amount: {
            "Amount": 0,
            "Clicks" : 0 
        },
        Coal: {
            "5Coal" : false,
            "10Coal" : false, 
            "25Coal" : false, 
            "50Coal" : false, 
            "100Coal" : false
        },  
        Silver: {
            "5Silver" : false,
            "10Silver" : false,
            "25Silver" : false,
            "50Silver" : false,
            "100Silver" : false
        },
        Gold: {
            "5Gold" : false,
            "10Gold" : false,
            "25Gold" : false,
            "50Gold" : false,
            "100Gold" : false
        },
        Diamond: {
            "5Diamond" : false,
            "10Diamond" : false,
            "25Diamond" : false,
            "50Diamond" : false,
            "100Diamond" : false
        },
        Uranium: {
            "5Uranium" : false,
            "10Uranium" : false,
            "25Uranium" : false,
            "50Uranium" : false,
            "100Uranium" : false
        },
        Clicker: {
            "1Clicker" : false,
            "1KClicker": false,
            "10KClicker" : false,
            "100KClicker" : false,
            "1MClicker" : false
        }
    }, 
    Money: {
        Amount: {
            "Total": 0,
            "Time" : 0
        }
    },
    Upgrades: {

    }
};

// ============== Reset ==============
const ResetSave = {
    Resources: {
        Click: {
            "Level" : 1,
            "Cost" : 10
        },
        Coal:  {
            "Level" : 0,
            "Cost" : 10,
            "Unlocked" : true
        },
        Silver: {
            "Level" : 0,
            "Cost" : 5000,
            "Unlocked" : false
        },
        Gold:  {
            "Level" : 0,
            "Cost" : 50000,
            "Unlocked" : false
        },
        Diamond:  {
            "Level" : 0,
            "Cost" : 250000,
            "Unlocked" : false
        },
        Uranium:  {
            "Level" : 0,
            "Cost" : 500000,
            "Unlocked" : false
        }
    },
    Achievements: {
        Amount: {
            "Amount": 0,
            "Clicks" : 0 
        },
        Coal: {
            "5Coal" : false,
            "10Coal" : false, 
            "25Coal" : false, 
            "50Coal" : false, 
            "100Coal" : false
        },  
        Silver: {
            "5Silver" : false,
            "10Silver" : false,
            "25Silver" : false,
            "50Silver" : false,
            "100Silver" : false
        },
        Gold: {
            "5Gold" : false,
            "10Gold" : false,
            "25Gold" : false,
            "50Gold" : false,
            "100Gold" : false
        },
        Diamond: {
            "5Diamond" : false,
            "10Diamond" : false,
            "25Diamond" : false,
            "50Diamond" : false,
            "100Diamond" : false
        },
        Uranium: {
            "5Uranium" : false,
            "10Uranium" : false,
            "25Uranium" : false,
            "50Uranium" : false,
            "100Uranium" : false
        },
        Clicker: {
            "1Clicker" : false,
            "1KClicker": false,
            "10KClicker" : false,
            "100KClicker" : false,
            "1MClicker" : false
        }
    }, 
    Money: {
        Amount: {
            "Total": 0,
            "Time" : 0
        }
    },
    Upgrades: {

    }
};
// Name Amount Level CostLevel_up

// ============== Core Functions ==============
// Initialize the game
function initGame() {
    const save = JSON.parse(localStorage.getItem("GameSave")); 
    return save || {...GameSave};
}

//Save Game state to localStorage
function saveGame() {
    localStorage.setItem("GameSave",JSON.stringify(GameSave));
}
function saveRest() {
        //Load and update save.
    const deepReset = JSON.parse(JSON.stringify(ResetSave));

    Object.assign(GameSave, deepReset);
    
    saveGame();
    updateResourceDisplay();
    UpdateUnlockButton();
    UpdateAchievements();
    UpdateClickerAH();
    Moneypersec();
        
    console.log("Youre Game has been reset");
    console.log("Game Save",GameSave);
}

//Level up the resources
function BuyNewDrill(resourceName) {
    //Load and update save.
    const loadedSave = initGame();
    Object.assign(GameSave,loadedSave);

    //Get the Specific resource.
    const resource = GameSave.Resources[resourceName];
    const Money = GameSave.Money.Amount;

    if(resource.Unlocked === true && Money.Total >= resource.Cost) {
        resource.Level += 1;
        Money.Total -= resource.Cost;
        // cost math prograsion stuff.
        resource.Cost = Math.round(resource.Cost * 1.1);


    } else if (resource.Unlocked === false){
        console.log("Resource in locked ")
    } else {
        console.log("Not enough ");
        console.log(`Cost is ${resource.Cost}`);
    }
    UnlockAchievements();
    saveGame();
    updateResourceDisplay();
    Moneypersec();
}

function nFormatter(num, digits = 1) {
    const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
    ];
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => num >= item.value);
    return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
}

function formatAmount(Amount) {
    return Amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}
// Updates the Displays of HTML. This is what you put in span to make it show up.
function updateResourceDisplay() {
    // Update all resource levels and costs
    const resources = ['Click','Coal', 'Silver', 'Gold', 'Diamond', 'Uranium'];
    resources.forEach(resource => {
        document.getElementById(`${resource}-level`).textContent = `${formatAmount(GameSave.Resources[resource].Level)}`;
        document.getElementById(`${resource}-cost`).textContent = `${(nFormatter(GameSave.Resources[resource].Cost, 1))}`;
    });

    // Update achievement count
    document.getElementById("Achievements-Amount").textContent = `${GameSave.Achievements.Amount.Amount} / 30`;
    // Update money with comma formatting
    // 10.000.000 ten milsion
    const Money = GameSave.Money.Amount.Total.toFixed(0); 
    if(Money < 1000000) {    
        document.getElementById("TotalCash").textContent = `${formatAmount(GameSave.Money.Amount.Total)} Cash`;
        document.getElementById("Title").textContent = `Cash: ${formatAmount(GameSave.Money.Amount.Total)}`
    } else {
        document.getElementById("TotalCash").textContent = `${(formatAmount(GameSave.Money.Amount.Total) / 1000000).toFixed(1)}M Cash`;
        document.getElementById("Title").textContent = `Cash: ${(formatAmount(GameSave.Money.Amount.Total)/ 1000000).toFixed(1)}M`
    }

}

function UnlockAchievements()  {
    const resours = ['Coal', 'Silver', 'Gold', 'Diamond', 'Uranium'];

    resours.forEach(res => {
        const MaterialLevel = GameSave.Resources[res].Level;
        const milestones = [100,50,25,10,5];

        milestones.forEach(threshold => {
            const AcivmentKey = `${threshold}${res}`;

            if(MaterialLevel >= threshold && !GameSave.Achievements[res][AcivmentKey]) {
                GameSave.Achievements[res][AcivmentKey] = true;
                GameSave.Achievements.Amount.Amount += 1;
                console.log(`🎉 Unlocked ${achievementKey} achievement!`);
            }
        })
    })

    UpdateAchievements();
}

function UpdateAchievements() {
    const resources = ['Coal', 'Silver', 'Gold', 'Diamond', 'Uranium'];

resources.forEach(resource => {
    const achievementData = GameSave.Achievements[resource];

    const achievementElement = document.getElementById(`${resource}Achievements`);
    
    let achievementHTML = '';

    // Define achievement milestones and their corresponding images
    const milestones = [
            { threshold: 100, image: `Acivment/${resource}/${resource}100.png` },
            { threshold: 50, image: `Acivment/${resource}/${resource}50.png` },
            { threshold: 25, image: `Acivment/${resource}/${resource}25.png` },
            { threshold: 10, image: `Acivment/${resource}/${resource}10.png` },
            { threshold: 5, image: `Acivment/${resource}/${resource}5.png` }
        ];

    
    // Check each milestone and add unlocked achievements
    milestones.forEach(milestone => {
        const achievementKey = `${milestone.threshold}${resource}`;

        if (achievementData[achievementKey]) {
            achievementHTML += `
                <img src="${milestone.image}" 
                    alt="${milestone.threshold} ${resource}" 
                    class="Achievements-Unlocked">`;
        }
    });
    
    achievementElement.innerHTML = achievementHTML;
});

// Handle Clicker separately if needed
}

function UnlockResource(Name) {
    const loadedSave = initGame();
    Object.assign(GameSave,loadedSave);

    const resource = GameSave.Resources[Name];
    const Money = GameSave.Money.Amount;
    // Silver
    if (Name === "Silver") {
        if (resource.Unlocked) {
            console.log("Silver is already unlocked!");
            return;
        }
        else if (Money.Total >= 5000) {
            // Deduct cost and unlock
            resource.Unlocked = true;
            Money.Total -= resource.Cost;
            UpdateUnlockButton();

            console.log("Silver unlocked! -5K");

        } else {
            console.log(`Need 5K`);
        }
    }
    //Gold
    else if (Name === "Gold") {

        if (resource.Unlocked) {
            console.log("Silver is already unlocked!");
            return;
        }
        else if (Money.Total >= 50000) {
            // Deduct cost and unlock
            resource.Unlocked = true;
            Money.Total -= resource.Cost;
            UpdateUnlockButton();

            console.log("Gold unlocked! -500K");

        } else {
            console.log(`Need 500K`);
        }
    }
    // Diamond
    else if (Name === "Diamond"){
        if (resource.Unlocked) {
            console.log("Silver is already unlocked!");
            return;
        }
        else if (Money.Total >= 250000) {
            // Deduct cost and unlock
            resource.Unlocked = true;
            Money.Total -= resource.Cost;
            UpdateUnlockButton();

            console.log("Diamond unlocked! -1M");

        } else {
            console.log(`Need 1M`);
        }
    }
    //
    else if (Name === "Uranium"){
        if (resource.Unlocked) {
            console.log("Uranium is already unlocked!");
            return;
        }
        else if (Money.Total >= 500000) {
            // Deduct cost and unlock
            resource.Unlocked = true;
            Money.Total -= resource.Cost;
            UpdateUnlockButton();

            console.log("Uranium unlocked! -5M");

        } else {
            console.log(`Need 5M`);
        }
    }
    else {
        console.log("Resource does not Excist.")
    }

    saveGame();
    updateResourceDisplay();
    UpdateUnlockButton();
}

function Moneypersec() {
    const Coal = GameSave.Resources.Coal;
    const Silver = GameSave.Resources.Silver;
    const Gold = GameSave.Resources.Gold;
    const Diamond = GameSave.Resources.Diamond;
    const Uranium = GameSave.Resources.Uranium;

    SumOfPer = (Coal.Level ) + (Silver.Level * 10) + (Gold.Level * 100) + (Diamond.Level * 1000) + (Uranium.Level * 10000)
    const Money = document.getElementById("Persec");
    Money.innerHTML = ` 
        ${formatAmount(SumOfPer)} / Sec
    
    `;
}
// Time Elapse 
function ResourcePerSecound() {

    ans = calculateEarnings();
    GameSave.Money.Amount.Total += ans / 10;
    updateResourceDisplay();
    saveGame();
}

function UpdateUnlockButton() {
    const containerSilver = document.getElementById("Silver-button");
    const containerGold = document.getElementById("Gold-button");
    const containerDiamond = document.getElementById("Diamond-button");
    const containerUranium = document.getElementById("Uranium-button");

    const Silver = GameSave.Resources.Silver;
    const Gold = GameSave.Resources.Gold;
    const Diamond = GameSave.Resources.Diamond;
    const Uranium = GameSave.Resources.Uranium;

    if(!Silver.Unlocked) {
        containerSilver.innerHTML = `
            <button class="Buttons-Right" onclick="UnlockResource('Silver')">
                Unlock Silver for 5K </button>
        `;
    } else {
        containerSilver.innerHTML = `
            <button class="Buttons-Right" onclick="BuyNewDrill('Silver')">
                Buy Drill
            </button>
        `;}

    if(!Gold.Unlocked) {
        containerGold.innerHTML = `
            <button class="Buttons-Right" onclick="UnlockResource('Gold')">
                Unlock Gold for 50K </button>
        `;
    } else {
        containerGold.innerHTML = `
            <button class="Buttons-Right" onclick="BuyNewDrill('Gold')">
                Buy Drill
            </button>
        `;
    }

    if(!Diamond.Unlocked) {
        containerDiamond.innerHTML = `
            <button class="Buttons-Right" onclick="UnlockResource('Diamond')">
                Unlock Diamond 250K </button>
        `;
    } else {
        containerDiamond.innerHTML = `
            <button class="Buttons-Right" onclick="BuyNewDrill('Diamond')">
                Buy Drill
            </button>
        `;
    }
    if(!Uranium.Unlocked) {
        containerUranium.innerHTML = `
            <button class="Buttons-Right" onclick="UnlockResource('Uranium')">
                Unlock Uranium 500K </button>
        `;
    } else {
        containerUranium.innerHTML = `
            <button class="Buttons-Right" onclick="BuyNewDrill('Uranium')">
                Buy Drill
            </button>
        `;
    }
}

function OfflineEarnings() {
    const currentTime = new Date();
    const currentTimeInMinutes = Math.floor(currentTime.getTime()/(1000*60));
    
    // 1. Get the OLD saved time (from when game was last closed)
    const savedTimeInMinutes = GameSave.Money.Amount.Time;

    // console.log(` current time ${currentTimeInMinutes} && previus time ${savedTimeInMinutes}`);
    // 2. CALCULATE earnings FIRST (using OLD time vs CURRENT time)
    let TimeDiffrance = currentTimeInMinutes - savedTimeInMinutes;
    // console.log(` DIff _ ${TimeDiffrance}`);
    if (savedTimeInMinutes && TimeDiffrance > 2) {
        let sumpersec = calculateEarnings();
        Eearnings = sumpersec * ( TimeDiffrance * 60);
        GameSave.Money.Amount.Total += Eearnings;
        console.log(`You earned ${Eearnings} while being offline for ${TimeDiffrance} Minutes`);
    }
    
    // 3. Only AFTER calculation, update to NEW time
    GameSave.Money.Amount.Time = currentTimeInMinutes;
    saveGame();
}

function calculateEarnings() {

    const Coal = GameSave.Resources.Coal
    const Silver = GameSave.Resources.Silver;
    const Gold = GameSave.Resources.Gold;
    const Diamond = GameSave.Resources.Diamond;
    const Uranium = GameSave.Resources.Uranium;

    const SumOfPer = 
    (Coal.Level )
    + (Silver.Level * 10) 
    + (Gold.Level * 100)
    + (Diamond.Level * 1000)
    + (Uranium.Level * 10000)
    // console.log(`${SumOfPer}`)
    return SumOfPer;
    
}

function HandleAHCLicker() {
    const threshold = ['1','1K','10K','100K','1M'];
    threshold.forEach(element => {
        const AcivmentKey = `${element}Clicker`;
        if(GameSave.Achievements.Amount.Clicks >= element && !GameSave.Achievements.Clicker[AcivmentKey]) {
            GameSave.Achievements.Clicker[AcivmentKey] = true;
            GameSave.Achievements.Amount.Amount += 1;
            updateResourceDisplay();
            UpdateClickerAH();
        }
    });
    UpdateClickerAH();

}

function UpdateClickerAH() {
    const achievementElement = document.getElementById("ClickerAchievements");
    const achievementData = GameSave.Achievements.Clicker;
    let achievementHTML ='';

    const milestones = [
            { threshold: 1000000, image: `Acivment/Clicker/Clicker1M.png`, key: "1M"},
            { threshold: 100000, image: `Acivment/Clicker/Clicker100K.png`, key: "100K"},
            { threshold: 10000, image: `Acivment/Clicker/Clicker10K.png`, key: "10K" },
            { threshold: 1000, image: `Acivment/Clicker/Clicker1K.png`, key: "1K" },
            { threshold: 1, image: `Acivment/Clicker/Clicker1.png`, key: "1" }
        ];

    // Check each milestone and add unlocked achievements
    milestones.forEach(milestone => {
        const achievementKey = `${milestone.key}Clicker`;
        // console.log(`Checking ${achievementKey}:`, achievementData[achievementKey]);

        if (achievementData[achievementKey]) {
            achievementHTML += `
                <img src="${milestone.image}" 
                    alt="${milestone.key}Clicker" 
                    class="Achievements-Unlocked">`;
        }
    });
    achievementElement.innerHTML = achievementHTML;
}

function HandleMouseClick(event) {
    GameSave.Achievements.Amount.Clicks += 1;
    const Money = GameSave.Money.Amount;
    const Clicker = GameSave.Resources.Click;
    Money.Total += Clicker.Level;

    HandleAHCLicker();

    x = event.clientX;
    y = event.clientY;
    //Pass it on to make the pop up.
    CreateNumberPopUp(x, y);
}

function CreateNumberPopUp(x, y) {
    const popup = document.createElement('div');
    popup.className = "PopUpNumber";
    popup.textContent = `+${GameSave.Resources.Click.Level}`;
    
    
    popup.style.left = (x - 20) + 'px'; 
    popup.style.top = (y - 10) + 'px';


    document.body.appendChild(popup);

    // remvoes itself after 1 sec
    setTimeout(() => popup.remove(), 1000);
}

function Trainhands() {
    const Hands = GameSave.Resources.Click;
    const Money = GameSave.Money.Amount;
    if(GameSave.Money.Amount.Total >= Hands.Cost) {
        console.log("Hands up");
        Money.Total -= Hands.Cost;
        Hands.Cost = Math.round(Hands.Cost * 1.2);
        Hands.Level += 1;
    }
}

function UpdateEverythingUI() {
    updateResourceDisplay();

}

function LoadingScreen() {
    const LoadScreen = document.createElement('div');
    LoadScreen.className = "loading-screen";
    LoadScreen.style.backgroundImage = "url('LoadScreen.png')";
    LoadScreen.style.backgroundSize = 'cover';
    LoadScreen.style.backgroundPosition = 'center';
    
    // Add overlay for better text visibility
    LoadScreen.innerHTML = `
        <h1 class="loading-h1"> Tatte01 <br>
        Javascript <br>
        Game Loading...</h1>
        <img src="/image.png" alt="Logo" class="Lodingicon">
    `;
    
    document.body.appendChild(LoadScreen);

    setTimeout(() => {
        LoadScreen.style.opacity = '0';
        setTimeout(() => LoadScreen.remove(), 1800);
    }, 1000);
}



// ============== Initialize on Load ==============
window.onload = function() {
    //Load existing save.
    LoadingScreen();
    const loadedSave = initGame();
    Object.assign(GameSave,loadedSave);

    UpdateUnlockButton();
    UpdateAchievements();
    UpdateClickerAH();
    Moneypersec();
    OfflineEarnings();
    window.setInterval(OfflineEarnings,60000)
    window.setInterval(ResourcePerSecound,100)
    console.log("Game loaded!",GameSave);
    console.log("Hello why are you looking in here ??");
}
