const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, updateDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDnSj05sE_daFrXocr_eusc2kdn2BcQwWI",
    authDomain: "scaffolded-logbook-research.firebaseapp.com",
    databaseURL: "https://scaffolded-logbook-research-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scaffolded-logbook-research",
    storageBucket: "scaffolded-logbook-research.firebasestorage.app",
    messagingSenderId: "151775571910",
    appId: "1:151775571910:web:91e3561f7d2e62ff7e4cc7",
    measurementId: "G-TLJ192MRLC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = 'scaffolded-logbook-research';

async function updateLinks() {
    console.log("Starting Firebase Update Script...");
    const teamsRef = collection(db, 'artifacts', appId, 'public', 'data', 'teams');

    try {
        const snapshot = await getDocs(teamsRef);
        let updatedCount = 0;

        for (const d of snapshot.docs) {
            const data = d.data();
            const teamName = data.teamName;
            let needsUpdate = false;
            let newPitchUrl = null;

            if (teamName.includes('BMI')) {
                newPitchUrl = "https://www.canva.com/design/DAHBFYqFQA4/NOQ8Bg1F_70BqhChxMORSg/edit";
                needsUpdate = true;
            } else if (teamName.includes('รา')) {
                newPitchUrl = "https://www.canva.com/design/DAHC88J9Ao0/pw2DPq3AJi6hGAVbbfn7VA/edit";
                needsUpdate = true;
            }

            if (needsUpdate && data.data && data.data.w5) {
                console.log(`Updating ${teamName} with new pitch URL...`);
                const teamDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'teams', d.id);

                await updateDoc(teamDocRef, {
                    'data.w5.pitchUrl': newPitchUrl
                });

                console.log(`Successfully updated ${teamName}`);
                updatedCount++;
            }
        }

        console.log(`Finished updating ${updatedCount} teams.`);
        process.exit(0);
    } catch (error) {
        console.error("Error updating links:", error);
        process.exit(1);
    }
}

updateLinks();
