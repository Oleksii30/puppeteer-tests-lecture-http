module.exports = {
	GREETINGS:
		'Hola amigo👋\n\n' +
		'Я - binary авто-тест 🤖. Готовий отримати фідбек про свою роботу?\n\n' +
		'Хочу зазначити, що я оцінюю тільки функціонал, за який ти можеш отримати максимум ${total} балів.\n' +
		'Решту балів виставить розробник із байнарі',
	GO_THROUGH_THE_LIST: 'Давай пройдемось по пунктах 📔',
	RESULT_PERFECT: 'Чудово! Всі тести пройдено 🎉. Так тримати!\n\nТвій поточний бал: ${score}/${total}🦜',
	RESULT_GOOD:
		'Непогана робота 👍. Але є моменти, які можна покращити. Якщо в тебе ще залишилися спроби, то було б добре виправити помилки 🛠️\n\nТвій поточний бал: ${score}/${total}🦜',
	RESULT_BAD:
		'Можна було б краще 🤷. Якщо в тебе залишились спроби, то виправ помилки. Я вірю в тебе 🙏\n\nТвій поточний бал: ${score}/${total}🦜',
	RESULT_WORST:
		'Виглядає так, що ти не зробив нічого, але даремно використав свою спробу.\n' +
		'Якщо ж ти виконав завдання, то перевір чи коректно вказаний лінк до репозиторія: https://bitbucket.org/<твій нікнейм>/<твій репозиторій>.git\n' +
		'Також перевір, чи є публічний доступ до репозиторія.\n' +
		'Якщо і це не допомогло, то напиши до служби підтримки.',
	SHOULD_SHOW_WARNING_WHEN_USERNAME_IS_EXISTS:
		'Має показатись модальне вікно з попередженням якщо користувач з введеним username уже існує',
	SHOULD__NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS:
		'В sessionStorage нічого не має записатись коли користувач з введеним username уже існує',
	SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT: 'Користувач має створити кімнату і бути перенаправленим у неї',
	SHOULD_SHOW_CREATED_ROOMS: 'Кімнати, створені іншим користувачами повині бути показані',
	SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM:
		'Має показуватись кількість користувачів у кімнаті на сторінці зі списком кімнат',
	SHOULD_CONNECT_TO_ROOM: 'Користувач має підключитись до кімнати по нажаттю на кнопку join',
	SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS:
		'Модальне вікно має показатись при створені кімнати, коли кімната з введеним іменем уже існує',
	ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER:
		'Кімната має бути видалена коли користувач нажимає Back to rooms і в кімнаті більше немає користувачів',
	ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS:
		'Кімната має видалитись коли користувач закриває вкладку і в кімнаті немає інших користувачів',
	SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS:
		'Кімнати де кількість користувачів більша ніж MAXIMUM_USERS_FOR_ONE_ROOM не повинні бути показані',
	SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS:
		'Кімната не повинна показуватись іншим користувачам коли почався таймер або триває гра',
	SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM: "Ім'я кімнати має бути показане в середині кімнати",
	SHOULD_WORK_BACK_TO_ROOMS_BUTTON: 'Кнопка "Back to rooms" повинна працювати',
	SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM: 'READY статус повинен бути показаний всім користувачам',
	SHOULD_SHOW_OTHER_USERS_IN_ROOM: 'Усі користувачі кімнати повинні бути показані у кімнаті',
	SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME:
		'Гра повинна початись коли усі користувачі готові. Повинен появитись таймер довжиною SECONDS_TIMER_BEFORE_START_GAME, після закінчення таймеру повинен появитись текст',
	SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME:
		'Гра повинна початись коли 2/3 юзерів готові, і не готовий юзер дисконектиться',
	SHOULD_SHOW_PROGRESS: 'Повинен показуватись прогрес гравців',
	SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE: 'Юзер, який закінчив гонку повинен бути виділеним',
	SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT:
		'Модалка з результатами повинна бути показана коли всі юзери ввели текст',
	SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT:
		'Гра повинна бути закінчена коли один юзер відключився, а інші ввели текст',
	SHOULD_CLEAR_AFTER_END_GAME:
		'Після закриття модалки з результатами, необхідно скинути статус всіх юзерів, показати кнопки Ready і Back to rooms',
	SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT:
		'Повинен бути зроблений HTTP запит за роутом /game/texts/:id для отримання тексту для гри',
	SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME: 'Гра повина закінчитись коли таймер вийшов (SECONDS_FOR_GAME)',
};
