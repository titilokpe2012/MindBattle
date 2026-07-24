```javascript
/* =====================================================
   ELEMENTS
===================================================== */

const form = document.getElementById("createDebateForm");

const titleInput = document.getElementById("debateTitle");

const categoryInput = document.getElementById("debateCategory");

const descriptionInput = document.getElementById("debateDescription");

const argumentForInput = document.getElementById("argumentFor");

const argumentAgainstInput = document.getElementById("argumentAgainst");

const previewTitle = document.getElementById("previewTitle");

const previewCategory = document.getElementById("previewCategory");

const previewDescription = document.getElementById("previewDescription");

const formMessage = document.getElementById("formMessage");

const submitButton = document.getElementById("submitButton");

const cancelButton = document.getElementById("cancelButton");


/* =====================================================
   RECUPERER LES DEBATS
===================================================== */

function getDebates() {

    const saved = localStorage.getItem(
        "mindbattleDebates"
    );

    if (!saved) {
        return [];
    }

    try {

        const debates = JSON.parse(saved);

        return Array.isArray(debates)
            ? debates
            : [];

    } catch (error) {

        console.error(
            "Erreur lors de la lecture des débats :",
            error
        );

        return [];

    }

}


/* =====================================================
   SAUVEGARDER LES DEBATS
===================================================== */

function saveDebates(debates) {

    localStorage.setItem(
        "mindbattleDebates",
        JSON.stringify(debates)
    );

}


/* =====================================================
   GENERER UN ID UNIQUE
===================================================== */

function generateId() {

    return (
        Date.now().toString()
        +
        "-"
        +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


/* =====================================================
   APERCU EN DIRECT
===================================================== */

function updatePreview() {

    const title =
        titleInput.value.trim();

    const category =
        categoryInput.value;

    const description =
        descriptionInput.value.trim();


    if (title) {

        previewTitle.textContent =
            title;

    } else {

        previewTitle.textContent =
            "Ton sujet apparaîtra ici";

    }


    if (category) {

        previewCategory.textContent =
            category;

    } else {

        previewCategory.textContent =
            "Catégorie";

    }


    if (description) {

        previewDescription.textContent =
            description;

    } else {

        previewDescription.textContent =
            "La description de ton débat apparaîtra ici.";

    }

}


/* =====================================================
   EVENEMENTS APERCU
===================================================== */

titleInput.addEventListener(
    "input",
    updatePreview
);

categoryInput.addEventListener(
    "change",
    updatePreview
);

descriptionInput.addEventListener(
    "input",
    updatePreview
);


/* =====================================================
   MESSAGE ERREUR
===================================================== */

function showError(message) {

    formMessage.textContent =
        message;

    formMessage.className =
        "form-message error";

}


function hideError() {

    formMessage.textContent =
        "";

    formMessage.className =
        "form-message";

}


/* =====================================================
   CREATION DU DEBAT
===================================================== */

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        hideError();


        /* =================================================
           RECUPERER LES DONNEES
        ================================================= */

        const title =
            titleInput.value.trim();

        const category =
            categoryInput.value;

        const description =
            descriptionInput.value.trim();

        const argumentFor =
            argumentForInput.value.trim();

        const argumentAgainst =
            argumentAgainstInput.value.trim();


        /* =================================================
           VALIDATION
        ================================================= */

        if (!title) {

            showError(
                "Veuillez entrer un sujet pour le débat."
            );

            titleInput.focus();

            return;

        }


        if (title.length < 10) {

            showError(
                "Le sujet doit contenir au moins 10 caractères."
            );

            titleInput.focus();

            return;

        }


        if (!category) {

            showError(
                "Veuillez choisir une catégorie."
            );

            categoryInput.focus();

            return;

        }


        if (!argumentFor) {

            showError(
                "Veuillez écrire un argument POUR."
            );

            argumentForInput.focus();

            return;

        }


        if (!argumentAgainst) {

            showError(
                "Veuillez écrire un argument CONTRE."
            );

            argumentAgainstInput.focus();

            return;

        }


        if (argumentFor.length < 10) {

            showError(
                "L'argument POUR doit contenir au moins 10 caractères."
            );

            argumentForInput.focus();

            return;

        }


        if (argumentAgainst.length < 10) {

            showError(
                "L'argument CONTRE doit contenir au moins 10 caractères."
            );

            argumentAgainstInput.focus();

            return;

        }


        /* =================================================
           VERIFIER L'UTILISATEUR CONNECTE
        ================================================= */

        const currentUserData =
            localStorage.getItem(
                "mindbattleCurrentUser"
            );


        if (!currentUserData) {

            showError(
                "Tu dois être connecté pour créer un débat."
            );

            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1500
            );

            return;

        }


        let currentUser;


        try {

            currentUser =
                JSON.parse(
                    currentUserData
                );

        } catch (error) {

            console.error(
                "Erreur utilisateur :",
                error
            );

            showError(
                "Impossible de récupérer ton compte. Veuillez vous reconnecter."
            );

            return;

        }


        /* =================================================
           VERIFIER QUE LE COMPTE EST VALIDE
        ================================================= */

        if (
            !currentUser
            ||
            !currentUser.id
        ) {

            showError(
                "Session utilisateur invalide. Veuillez vous reconnecter."
            );

            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1500
            );

            return;

        }


        /* =================================================
           DESACTIVER LE BOUTON
        ================================================= */

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Publication...";


        /* =================================================
           RECUPERER LES DEBATS
        ================================================= */

        const debates =
            getDebates();


        /* =================================================
           CREER LE NOM DE L'AUTEUR
        ================================================= */

        let authorName = "";


        if (
            currentUser.firstName
            ||
            currentUser.lastName
        ) {

            authorName =

                (
                    currentUser.firstName
                    ||
                    ""
                )

                +

                " "

                +

                (
                    currentUser.lastName
                    ||
                    ""
                );

        }


        if (
            !authorName.trim()
            &&
            currentUser.username
        ) {

            authorName =
                currentUser.username;

        }


        if (
            !authorName.trim()
        ) {

            authorName =
                "Utilisateur";

        }


        /* =================================================
           CREER LE NOUVEAU DEBAT
        ================================================= */

        const newDebate = {

            id:
                generateId(),

            title:
                title,

            category:
                category,

            description:
                description,

            argumentFor:
                argumentFor,

            argumentAgainst:
                argumentAgainst,


            /* =============================================
               INFORMATIONS CREATEUR
            ============================================= */

            creatorId:
                currentUser.id,

            author:
                authorName.trim(),

            authorUsername:
                currentUser.username
                ||
                "utilisateur",

            authorAvatar:
                currentUser.avatar
                ||
                "🧠",


            /* =============================================
               DATE
            ============================================= */

            createdAt:
                new Date().toISOString(),


            /* =============================================
               STATUT
            ============================================= */

            status:
                "En cours",


            /* =============================================
               STATISTIQUES
            ============================================= */

            views:
                0,

            votesFor:
                0,

            votesAgainst:
                0,

            comments:
                []

        };


        /* =================================================
           AJOUTER LE DEBAT
        ================================================= */

        debates.push(
            newDebate
        );


        /* =================================================
           SAUVEGARDER LE DEBAT
        ================================================= */

        saveDebates(
            debates
        );


        /* =================================================
           METTRE A JOUR LES STATISTIQUES UTILISATEUR
        ================================================= */

        currentUser.debatesCreated =

            (
                Number(
                    currentUser.debatesCreated
                )
                ||
                0
            )

            +

            1;


        /* =================================================
           AJOUTER 10 POINTS
        ================================================= */

        currentUser.points =

            (
                Number(
                    currentUser.points
                )
                ||
                0
            )

            +

            10;


        /* =================================================
           RECUPERER LES UTILISATEURS
        ================================================= */

        const usersData =

            localStorage.getItem(
                "mindbattleUsers"
            );


        let users = [];


        if (usersData) {

            try {

                const parsedUsers =
                    JSON.parse(
                        usersData
                    );

                if (
                    Array.isArray(
                        parsedUsers
                    )
                ) {

                    users =
                        parsedUsers;

                }

            } catch (error) {

                console.error(
                    "Erreur lors de la lecture des utilisateurs :",
                    error
                );

                users = [];

            }

        }


        /* =================================================
           TROUVER L'UTILISATEUR
        ================================================= */

        const userIndex =

            users.findIndex(
                function(user) {

                    return (
                        user.id
                        ===
                        currentUser.id
                    );

                }
            );


        /* =================================================
           METTRE A JOUR L'UTILISATEUR
        ================================================= */

        if (
            userIndex !== -1
        ) {

            users[userIndex] =
                currentUser;

            localStorage.setItem(

                "mindbattleUsers",

                JSON.stringify(
                    users
                )

            );

        }


        /* =================================================
           METTRE A JOUR LA SESSION
        ================================================= */

        localStorage.setItem(

            "mindbattleCurrentUser",

            JSON.stringify(
                currentUser
            )

        );


        /* =================================================
           REDIRECTION
        ================================================= */

        window.location.href =

            "debate.html?id="

            +

            encodeURIComponent(
                newDebate.id
            );

    }
);


/* =====================================================
   BOUTON ANNULER
===================================================== */

cancelButton.addEventListener(
    "click",
    function() {

        const hasContent =

            titleInput.value.trim()

            ||

            descriptionInput.value.trim()

            ||

            argumentForInput.value.trim()

            ||

            argumentAgainstInput.value.trim();


        if (hasContent) {

            const confirmCancel =

                confirm(
                    "Tu as commencé à remplir ce débat. Veux-tu vraiment annuler ?"
                );


            if (!confirmCancel) {

                return;

            }

        }


        window.location.href =
            "debates.html";

    }
);


/* =====================================================
   INITIALISER L'APERCU
===================================================== */

updatePreview();
```
