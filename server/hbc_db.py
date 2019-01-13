import sys
# PySyft decouples private data from model training, using Multi-Party Computation (MPC) within PyTorch.
import syft as sy
import string

# print( len(sys.argv))
# print (str(sys.argv))

hook = sy.TorchHook()


#remote workers for MPC
bob = sy.VirtualWorker(id="bob")
alice = sy.VirtualWorker(id="alice")
bill = sy.VirtualWorker(id="bill")


char2int = {}
int2char = {}

for i, c in enumerate(' ' + string.ascii_letters + '0123456789' + string.punctuation):
    char2int[c] = i
    int2char[i] = c


# this is our key system, computed with secure MPC
def string2key(input_str):
    return sy.LongTensor([hash(input_str) % sy.mpc.securenn.field])

# value storage system, also uses secure MPC
def string2values(key, input_str):
    values = list()
    for char in input_str:
        values.append(char2int[char])
    return sy.LongTensor(values)

def values2string(input_values):
    s = ""
    for v in input_values:
        s += int2char[int(v)]
    return s

def one_hot(index, length):
    vect = sy.zeros(length).long()
    vect[index]  = 1
    return vect

def string2one_hot_matrix(str_input, max_len=8):
    # truncate strings longer than max_len
    str_input = str_input[:max_len].lower()

    # pad strings shorter than max_len
    if(len(str_input) < max_len):
        str_input = str_input + "." * (max_len - len(str_input))

    char_vectors = list()
    for char in str_input:
        char_vectors.append(one_hot(char2int[char],len(int2char)).unsqueeze(0))

    return sy.cat(char_vectors,dim=0)

def string2values(str_input, max_len=128):
    # truncate strings longer than max_len
    str_input = str_input[:max_len].lower()

    # pad strings shorter than max_len
    if(len(str_input) < max_len):
        str_input = str_input + "." * (max_len - len(str_input))


    values = list()
    for char in str_input:
        values.append(char2int[char])

    return sy.LongTensor(values)

class DecentralizedDB:

    def __init__(self, *owners, max_key_len=8, max_value_len=256):
        self.max_key_len = max_key_len
        self.max_value_len = max_value_len
        self.owners = owners
        self.keys = list()
        self.values = list()

    def add_entry(self, string_key, string_value):
        key = string2one_hot_matrix(string_key, self.max_key_len).share(*self.owners)
        value = string2values(string_value, self.max_value_len).share(*self.owners)

        self.keys.append(key)
        self.values.append(value)

    def query(self,query_str):
        query = string2one_hot_matrix(query_str, self.max_key_len).send(*self.owners)

        # see if our query matches any key
        # note: this is the slowest part of the program
        # it could probably be greatly faster with minimal improvements
        key_match = list()
        for key in self.keys:
            vect = (key * query).sum(1)
            x = vect[0]
            for i in range(vect.get_shape()[0]):
                x = x * vect[i]
            key_match.append(x)

        # Multiply each row's value by its corresponding keymatch
        value_match = list()
        for i, value in enumerate(self.values):
            shape = list(value.get_shape())
            km = key_match[i]
            expanded_key = km.expand(1,shape[0])[0]
            value_match.append(expanded_key * value)

        # NOTE: everything before this line could (in theory) happen in full parallel
        # on different threads.

        # sum the values together
        final_value = value_match[0]
        for v in value_match[1:]:
            final_value = final_value + v

        result = values2string(final_value.get())

        return result.replace(".","")

db  = DecentralizedDB(bob, alice, bill, max_key_len=3)
db.add_entry("BTC 123234234","50, 30")
db.add_entry("ETH 0xd61092fb5ae3838eb8d746387295d43827483789c5dd69d71c6263e8ec0a29d4", "10, 400")
db.add_entry("IOTA ZIKGPGNCJRKGFCIZHQTPL9KPLGBNPISCGPNRYUOGPDEBKBCFCLSUZC9WXEDSXIEEZDZFD9GLLMKCZ9999","40, 90")
db.add_entry("XRP n9K1ZXXXzzA3dtgKBuQUnZXkhygMRgZbSo3diFNPVHLMsUG5osJM","80, 20")

# "ETH 0xd61092fb5ae3838eb8d746387295d43827483789c5dd69d71c6263e8ec0a29d4"
print(db.query(sys.argv[1]))