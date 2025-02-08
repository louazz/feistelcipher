export class Feistel{
    key : Array<string>;
    L : string;
    R: string; 
    round: number;
    fun: Function;
    spaces: Array<number>;

    constructor(plaintext:string, key: Array<string>, r: number, fun: Function, encryption: boolean, L:string, R:string, spaces:Array<number>) {
        if (encryption==true){
            var counter = 0
            var tmp = []
            for (let i=0; i < plaintext.length ; i++){
                 if (plaintext[i]== " "){
                    tmp.push(i- counter)
                    counter +=1
                }
            }
            this.spaces = tmp;
        plaintext= plaintext.replace(/ /g, "")
        this.L = plaintext.substring(0, plaintext.length/2)
        this.R = plaintext.substring(plaintext.length/2, plaintext.length)
        }else{
            this.L = L;
            this.R = R
            this.spaces= spaces

        }
        
        this.key = key;
        this.round= r
        this.fun = fun
    }
    reconstruct(plainText: string, spaces=this.spaces): string{
        var spaced = ""
        for (let i=0; i < plainText.length ; i++){
            
            if (this.spaces.includes(i)){
                spaced += " "
            }
            spaced += plainText[i]
        }
        return spaced
    }

    xor(a: string, b: string): string{
        return Array.from(a).reduce((xored, c, idx) => xored + String.fromCharCode(c.charCodeAt(0) ^ b.charCodeAt(idx)), '')

    }

    encrypt(L= this.L, R=this.R, key=this.key, i=0):any{
    
        var R_enc = R
        var L_enc = this.xor(L,this.fun(R, key[i]))
        if (i < this.round){
            return this.encrypt(L=R_enc, R=L_enc, key, i+1)
        }else {
            return [[L_enc, R_enc], this.spaces]
        }
           }

    decrypt(L= this.R, R=this.L, key=this.key, r= this.round, i=0, F= this.fun): any{
     
        var R_enc = L
        var L_enc = this.xor(R, F(L, key[r-i]))

        if (i < r){
            return this.decrypt(L=L_enc,R=R_enc, key, r, i+1, F)
        }else {
        
            return [L_enc, R_enc].join('')
        }
        
    }
}

