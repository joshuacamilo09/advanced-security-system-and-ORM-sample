Serialization básica para remover campos sensíveis:

para uma SaaS é importnte saber essa cena de remover campos sensiveis.

Exemplo:

import { Exclude } from 'class-transformer';

export class User {
  id: number;

  username: string;

  @Exclude()
  password: string;
}

Ao retornar um objeto User em uma resposta HTTP (por exemplo, em um controller), o password não vai aparecer no JSON.

Isso é exatamente remover campos sensíveis das respostas, que é o uso mais comum de serialization.

Mais serialization é mais amplo.

Além de remover campos sensiveis, serialization também permite: 

1. Renomenar campos na resposta: 

@Expose({ name: 'userName' })
username: string;




2. Criar campos calculados ou temporários:

@Expose()
get fullName(): string {
  return `${this.firstName} ${this.lastName}`;
}


3. Transformar relacionamentos a complexos (como MikeORM reference e collection)

@ManyToOne({
  serializer: (author) => author.name,
  serializedName: 'authorName',
})
author: Author;


4. Remover dados do banco mas manter campos na memoria para resposta:

@Property({ persist: false })
count?: number;