<script lang="ts">
	import {
		KC_STORE_KEY,
		useDarkMode,
		useJokerStore,
		useKeycloakStore,
		type KEYCLOAK_TYPE
	} from '$lib/stores';
	import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js';
	import { getContext, onMount } from 'svelte';
	import { type Writable } from 'svelte/store';
	import Header from './Header.svelte';
	import './styles.css';
	const darkMode = useDarkMode();
	const jokerStore = useJokerStore();
	const keyclockStore: any = useKeycloakStore();
	const keyclockContextStore = getContext<Writable<KEYCLOAK_TYPE>>(KC_STORE_KEY);

	const kcConfig: KeycloakConfig = {
		url: 'http://localhost:8080',
		realm: 'angular_dev',
		clientId: 'e_commerce'
	};
	const kcInitOptions: KeycloakInitOptions = {
		onLoad: 'login-required',
		checkLoginIframe: false,
		redirectUri: 'http://localhost:5173/'
	};

	let keycloakInstance: Keycloak;

	onMount(async () => {
		kcInitOptions.redirectUri += '/' + window.location.pathname;
		keycloakInstance = new Keycloak(kcConfig);
		const authenticateStorage = getAuthenticateStorage();

		keycloakInstance
			.init(kcInitOptions)
			.then((auth) => {
				keyclockStore.setProfile({ authenticated: auth });
			})
			.catch((error: any) => {
				console.log('keycloak init error ', error);
			});

		jokerStore.setJoker('new joker');

		keycloakInstance.onReady = () => {
			console.log('ready', keycloakInstance);
			keyclockStore.setProfile({
				clientId: keycloakInstance.clientId,
				realm: keycloakInstance.realm,
				// token: keycloakInstance.token,
				redirectUri: keycloakInstance.redirectUri,
				// tokenParsed: keycloakInstance.tokenParsed,
				resourceAccess: keycloakInstance.resourceAccess,
				hasRealmRole: keycloakInstance.hasRealmRole('uma_authorization'),
				hasResourceRole: keycloakInstance.hasResourceRole('manage-account', 'account')
			});

			keycloakInstance.loadUserProfile().then((user: any) => {
				keyclockStore.setProfile({ profile: user });
			});
		};

		keycloakInstance.onAuthRefreshSuccess = () => {
			console.log('onAuthRefreshSuccess');
		};

		keycloakInstance.onTokenExpired = () => {
			console.log('onTokenExpired');
			keycloakInstance
				.updateToken(30)
				.then(function (refreshed) {
					if (refreshed) {
						console.log('Token was successfully refreshed');
					} else {
						console.log('Token is still valid');
					}
				})
				.catch(function () {
					alert('Failed to refresh the token, or the session has expired');
				});
		};

		keyclockStore.subscribe((data: Record<string, any>) => {
			console.log('keyclockStore subscribe ', data);
		});
	});

	const logOut = () => {
		if (typeof keycloakInstance?.logout == 'function') {
			keycloakInstance.logout();
		}
	};

	const getAuthenticateStorage = (key: string = 'authenticated') => {
		try {
			const authenticated = localStorage.getItem(key) ?? 'false';
			return JSON.parse(authenticated);
		} catch (error) {
			return false;
		}
		return false;
	};
</script>

<div class="app">
	<Header />

	<main>
		{#if $keyclockStore?.authenticated}
			<button on:click={logOut}>Logout</button>
		{/if}

		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
