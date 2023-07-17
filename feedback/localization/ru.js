module.exports = {
    GREETINGS:
        'Hola amigo👋\n\n' +
        'Я - binary авто-тест 🤖. Готов получить фидбэк о своей работе?\n\n' +
        'Хочу отметить, что я оцениваю только функционал, за который ты можешь получить максимум ${total} баллов.\n' +
        'Остальные баллы выставит разработчик с байнари',
    GO_THROUGH_THE_LIST: 'Давай пройдемось по пунктах 📔',
    RESULT_PERFECT: 'Чудово! Всі тести пройдено 🎉. Так тримати!\n\nТвій поточний бал: ${score}/${total}🦜',
    RESULT_GOOD:
        'Непогана робота 👍. Але є моменти, які можна покращити. Якщо в тебе ще залишилися спроби, то було б добре виправити помилки 🛠️\n\nТвій поточний бал: ${score}/${total}🦜',
    RESULT_BAD:
        'Можна було б краще 🤷. Якщо в тебе залишились спроби, то виправ помилки. Я вірю в тебе 🙏\n\nТвій поточний бал: ${score}/${total}🦜',
    RESULT_WORST:
        'Виглядає так, що ти не зробив нічого, але даремно використав свою спробу.\n' +
        'Якщо ж ти виконав завдання, то перевір чи коректно вказаний лінк до репозиторія: https://bitbucket.org/<твой юзернейм>/<твой репозиторий>.git\n' +
        'Також перевір, чи є публічний доступ до репозиторія.\n' +
        'Якщо і це не допомогло, то напиши до служби підтримки.',

    SHOULD_SHOW_WARNING_AND_NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS:
		'Должно показаться модальное окно с предупреждением и в sessionStorage ничего не должно записаться, когда пользователь с введенным username уже существует',
	SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT: 'Пользователь должен создать комнату и быть перенаправлен в нее',
	SHOULD_SHOW_CREATED_ROOMS: 'Комнаты, созданные другими пользователями должны быть показаны',
	SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM:
		'Должно показывать количество пользователей в комнате на странице списка комнат',
	SHOULD_CONNECT_TO_ROOM: 'Пользователь должен подключиться к комнате по нажатию на кнопку join',
	SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS:
		'Модальное окно должно показаться при созданной комнате, когда комната с введенным именем уже существует',
	ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER:
		'Комната должна быть удалена, когда пользователь нажимает "Back to rooms" и в комнате больше нет пользователей',
	ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS:
		'Комната должна удалиться, когда пользователь закрывает вкладку и в комнате нет других пользователей',
	SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS:
		'Комнаты, где количество пользователей больше MAXIMUM_USERS_FOR_ONE_ROOM не должны быть показаны',
	SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS:
		'Комната не должна показываться другим пользователям, когда начался таймер или продолжается игра.',
	SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM: "Имя комнаты должно быть показано внутри комнаты",
	SHOULD_WORK_BACK_TO_ROOMS_BUTTON: 'Кнопка "Back to rooms" должна работать',
	SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM: 'READY статус должен быть показан всем пользователям',
	SHOULD_SHOW_OTHER_USERS_IN_ROOM: 'Все пользователи комнаты должны быть показаны в комнате',
	SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME:
		'Игра должна начаться, когда все пользователи готовы. Должен появиться таймер длиной SECONDS_TIMER_BEFORE_START_GAME, после окончания таймера должен появиться текст',
	SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME:
		'Игра должна начаться когда 2/3 пользователей готовы, и не готовый пользователь дисконектируется',
	SHOULD_SHOW_PROGRESS: 'Должен показываться прогресс игроков',
	SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE: 'Юзер, закончивший гонку должен быть выделен',
	SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT:
		'Модалка с результатами должна быть показана когда все пользователи ввели текст',
	SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT:
		'Игра должна быть закончена, когда один юзер отключился, а другие ввели текст.',
	SHOULD_CLEAR_AFTER_END_GAME:
		'После закрытия модалки с результатами, нужно сбросить статус всех пользователей, показать клавиши Ready и Back to rooms',
	SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT:
		'Должен быть сделан HTTP запрос по роуту /game/texts/:id для получения текста для игры',
	SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME: "Игра должна закончиться когда таймер вышел (SECONDS_FOR_GAME)",
};
