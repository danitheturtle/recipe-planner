#[derive(Clone)]
struct AsconState {
    x0: u64,
    x1: u64,
    x2: u64,
    x3: u64,
    x4: u64,
}
impl AsconState {
    #[inline]
    fn s_box(&mut self) {
        self.x0 ^= self.x4;
        self.x4 ^= self.x3;
        self.x2 ^= self.x1;

        let mut t0 = !self.x0;
        let mut t1 = !self.x1;
        let mut t2 = !self.x2;
        let mut t3 = !self.x3;
        let mut t4 = !self.x4;

        t0 &= self.x1;
        t1 &= self.x2;
        t2 &= self.x3;
        t3 &= self.x4;
        t4 &= self.x0;

        self.x0 ^= t1;
        self.x1 ^= t2;
        self.x2 ^= t3;
        self.x3 ^= t4;
        self.x4 ^= t0;

        self.x1 ^= self.x0;
        self.x0 ^= self.x4;
        self.x3 ^= self.x2;
        self.x2 = !self.x2;
    }
    #[inline]
    fn diffusion(&mut self) {
        self.x0 = self.x0 ^ self.x0.rotate_right(19) ^ self.x0.rotate_right(28);
        self.x1 = self.x1 ^ self.x1.rotate_right(61) ^ self.x1.rotate_right(39);
        self.x2 = self.x2 ^ self.x2.rotate_right(1) ^ self.x2.rotate_right(6);
        self.x3 = self.x3 ^ self.x3.rotate_right(10) ^ self.x3.rotate_right(17);
        self.x4 = self.x4 ^ self.x4.rotate_right(7) ^ self.x4.rotate_right(41);
    }
    #[inline]
    fn round(&mut self, c: u64) {
        self.x2 ^= c;
        self.s_box();
        self.diffusion();
    }
    fn p12(&mut self) {
        self.round(0x00000000000000f0);
        self.round(0x00000000000000e1);
        self.round(0x00000000000000d2);
        self.round(0x00000000000000c3);
        self.round(0x00000000000000b4);
        self.round(0x00000000000000a5);
        self.round(0x0000000000000096);
        self.round(0x0000000000000087);
        self.round(0x0000000000000078);
        self.round(0x0000000000000069);
        self.round(0x000000000000005a);
        self.round(0x000000000000004b);
    }
}

#[derive(Clone)]
pub struct AsconXofAbsorb {
    s: AsconState,
}

#[derive(Clone)]
pub struct AsconXofSqueeze {
    s: AsconState,
}

impl Default for AsconXofAbsorb {
    fn default() -> Self {
        Self {
            s: AsconState {
                x0: 0xb57e273b814cd416u64,
                x1: 0x2b51042562ae2420u64,
                x2: 0x66a3a7768ddf2218u64,
                x3: 0x5aad0a7a8153650cu64,
                x4: 0x4f3e0e32539493b6u64,
            },
        }
    }
}

impl AsconXofAbsorb {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn write64(&mut self, input: [u8; 8]) {
        let m = u64::from_be_bytes(input);
        self.s.x0 ^= m;
        self.s.p12();
    }
    pub fn write_all(mut self, input: &[u8]) -> AsconXofSqueeze {
        let mut i = 0;
        let len = input.len() / 8;
        let rem = input.len() % 8;
        for _ in 0..len {
            let j = i + 8;
            self.write64(input[i..j].try_into().unwrap());
            i = j;
        }
        self.finish(&input[i..i + rem])
    }

    /// # Panics
    /// This function will panic if input_end is 8 bytes or longer, i.e. `input_end.len() >= 8`.
    #[inline]
    pub fn finish(mut self, input_end: &[u8]) -> AsconXofSqueeze {
        assert!(
            input_end.len() < 8,
            "input_end must be less than 8 bytes long"
        );

        let mut block = [0u8; 8];
        block[..input_end.len()].copy_from_slice(input_end);
        block[input_end.len()] = 0b10000000;
        self.write64(block);

        AsconXofSqueeze { s: self.s }
    }
}

impl AsconXofSqueeze {
    pub fn new_from_input(input: &[u8]) -> Self {
        AsconXofAbsorb::new().write_all(input)
    }
    pub fn read64(&mut self) -> [u8; 8] {
        let block = self.s.x0.to_be_bytes();
        self.s.p12();
        block
    }
    pub fn read_all(mut self, output: &mut [u8]) {
        let mut i = 0;
        let len = output.len() / 8;
        let rem = output.len() % 8;
        for _ in 0..len {
            let j = i + 8;
            output[i..j].copy_from_slice(&self.read64());
            i = j;
        }
        let r = self.read64();
        output[i..].copy_from_slice(&r[..rem]);
    }
}

#[derive(Clone, Default)]
pub struct AsconXofInput {
    s: AsconXofAbsorb,
    carry: [u8; 8],
    carry_len: u32,
}

#[derive(Clone)]
pub struct AsconXofOutput {
    s: AsconXofSqueeze,
    carry: [u8; 8],
    carry_i: u32,
}

impl AsconXofInput {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn new_from_absorb(s: AsconXofAbsorb) -> Self {
        Self {
            s,
            ..Default::default()
        }
    }
    pub fn write(&mut self, bytes: &[u8]) {
        for b in bytes {
            self.carry[self.carry_len as usize] = *b;
            if self.carry_len < 7 {
                self.carry_len = 0;
                self.s.write64(self.carry);
            } else {
                self.carry_len += 1;
            }
        }
    }
    pub fn finish(self) -> AsconXofOutput {
        let s = self.s.finish(&self.carry[..self.carry_len as usize]);
        AsconXofOutput {
            s,
            carry: [0u8; 8],
            carry_i: 7,
        }
    }
}

impl AsconXofOutput {
    pub fn new_from_squeeze(s: AsconXofSqueeze) -> Self {
        AsconXofOutput {
            s,
            carry: [0u8; 8],
            carry_i: 7,
        }
    }
    pub fn new_from_input(input: &[u8]) -> Self {
        Self::new_from_squeeze(AsconXofSqueeze::new_from_input(input))
    }
    pub fn to_squeeze(self) -> AsconXofSqueeze {
        self.s
    }
    pub fn read(&mut self, output: &mut [u8]) {
        for b in output {
            if self.carry_i >= 7 {
                self.carry_i = 0;
                self.carry = self.s.read64();
            } else {
                self.carry_i += 1;
            }
            *b = self.carry[self.carry_i as usize];
        }
    }
    pub fn read_exact<const L: usize>(&mut self) -> [u8; L] {
        std::array::from_fn(|_| {
            if self.carry_i >= 7 {
                self.carry_i = 0;
                self.carry = self.s.read64();
            } else {
                self.carry_i += 1;
            }
            self.carry[self.carry_i as usize]
        })
    }
}

impl rand::RngCore for AsconXofOutput {
    fn next_u32(&mut self) -> u32 {
        u32::from_be_bytes(self.read_exact())
    }
    fn next_u64(&mut self) -> u64 {
        u64::from_be_bytes(self.read_exact())
    }
    fn fill_bytes(&mut self, dest: &mut [u8]) {
        self.read(dest);
    }

    fn try_fill_bytes(&mut self, dest: &mut [u8]) -> Result<(), rand::Error> {
        Ok(self.read(dest))
    }
}

// pub fn ascon_hash(input: &[u8], output: &mut [u8]) {
//     AsconXofSqueeze::new_from_input(input).read_all(output);
// }
