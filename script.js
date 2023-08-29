
// ================================================================================================
// INTERACTIVITY AND SELECTORS
// ================================================================================================

const random_activity_button = document.getElementById('random-activity-button');
const activity_type_button = document.getElementById('random-type-button');
const activity_type_select = document.getElementById('activity-type-select');

// hardcoded the available types from the Boredom API
const activity_types = [
    "relaxation",
    "cooking",
    "recreational",
    "education",
    "busywork",
    "music",
    "charity",
    "diy",
    "social" 
]

// Dynamically map our options array into the select
activity_types.forEach(
    type => {
        const new_option = document.createElement('option');
        new_option.value = type;
        new_option.textContent = type;
        activity_type_select.appendChild(new_option);
    }
)

// Handle adding a new random activity to the DOM
random_activity_button.addEventListener('click', () => {
    getRandomActivity().then(
        activity_data => {
            displayActivityData(activity_data)
        }
    )
})

// Handle adding a new random activity by type to the DOM
activity_type_button.addEventListener('click', () => {
    getRandomActivityByType().then(
        activity_data => {
            displayActivityData(activity_data)
        }
    )
})

// Mounts an initial activity into the DOM when load is complete
window.addEventListener('load', () => {
    getRandomActivity().then(
        activity_data => {
            displayActivityData(activity_data)
        }
    )
})


// ================================================================================================
// BORED API METHODS.. .Check Docs here: https://www.boredapi.com/documentation#endpoints-random
// ================================================================================================

const api_route = 'https://www.boredapi.com/api/'

const getRandomActivity = async() =>
{
    return await fetch(`${api_route}activity`)
    .then(
        res => {
            res = res.json()
            return res
        }
    ).catch(
        error => {
            throw Error(error)
        }
    )
}

const getRandomActivityByType = async() =>
{
    const type = activity_type_select.value
    return await fetch(`${api_route}activity?type=${activity_type_select.value}`)
    .then(
        res => {
            res = res.json()
            return res
        }
    ).catch(
        error => {
            throw Error(error)
        }
    )
}

// ================================================================================================
// DOM MANIPULATION CODE
// ================================================================================================

// Checks the 'activity-key' attribute we set in the creation handler and removes the element if the keys match
const handleRemoveElementByKey = (key) =>
{
    if(!key) return console.log('no key value provided');

    const elements_with_keys = Array.from(document.querySelectorAll('[activity-key]'))

    const element_to_remove = elements_with_keys.find(
        element => {
            const activity_key = element.getAttribute('activity-key')
            return activity_key === key
        }
    )

    if (element_to_remove) element_to_remove.remove();

    else return 'no element with that key was found'
}

// Creates a new Activity card from template and appends it into the content section
const displayActivityData = (activity_data) =>
{
    if (!activity_data) throw Error(`No input data provided to card render method`);

    // clone the existing template into a new element
    const template = document.getElementById('activity-card-template');
    const new_activity_card = template.content.cloneNode(true);
    const activity_display = document.getElementById('activity-display');

    // Grab the required elements we need to populate with API data
    const parent_div = new_activity_card.querySelector('[activity-key]')
    const title = new_activity_card.querySelector('[activity-title]')
    const accessbility = new_activity_card.querySelector('[accessibility-score]');
    const price = new_activity_card.querySelector('[price-score]');
    const participants = new_activity_card.querySelector('[participants]');
    const type = new_activity_card.querySelector('[activity-type]');

    // Attach event listener for removing the Activity Card
    const remove_button = new_activity_card.querySelector('[remove-activity]');
    remove_button.addEventListener('click', () => handleRemoveElementByKey(activity_data.key))

    // Set the properties
    parent_div.setAttribute('activity-key', activity_data.key)
    title.innerText = activity_data.activity;
    accessbility.innerText = `${activity_data.accessibility * 10} / 10`;
    price.innerText = `${activity_data.price * 10} / 10`;
    participants.innerText = activity_data.participants;
    type.innerText = activity_data.type;

    // Attach it to the DOM
    activity_display.appendChild(new_activity_card);
}
