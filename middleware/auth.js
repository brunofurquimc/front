export default function ({ store, redirect }) {
  const storeUser = store?.state?.users?.user
  const localStorageUser = JSON.parse(localStorage.getItem('user'))
  if (storeUser == undefined && localStorageUser == undefined)
    redirect('/auth') // redireciona para tela de autenticacao
  else {
    // caso um dos dois seja undefined, seta os dois novamente
    if (storeUser == undefined || localStorageUser == undefined) {
      store.commit('users/setUser', storeUser != undefined ? storeUser : localStorageUser)
    }
  }
}